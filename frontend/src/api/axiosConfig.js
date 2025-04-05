import axios from 'axios';
import secureStorage from '../utils/secureStorage';
import apiCache from '../utils/apiCache';
import validation from '../utils/validation';
import performanceMonitor from '../utils/performanceMonitor';

// Create the base URL configuration
const baseURL =
  process.env.NODE_ENV === 'production' ? '' : `http://${window.location.hostname}:5000`;

console.log('[AXIOS] Initializing with baseURL:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Cache configuration
const CACHEABLE_URLS = ['/practice-areas', '/about', '/blog', '/home-cards'];

const isCacheableRequest = (url = '') => {
  return (
    CACHEABLE_URLS.some(cacheableUrl => url.includes(cacheableUrl)) &&
    !url.includes('upload') &&
    !url.includes('edit') &&
    !url.includes('delete')
  );
};

// Helper function to get CSRF token from cookies
const getCSRFToken = () => {
  const csrfCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('XSRF-TOKEN='));

  if (csrfCookie) {
    return csrfCookie.split('=')[1];
  }
  return null;
};

// Generate a cache key from the request
const generateCacheKey = config => {
  const { url, params, method } = config;
  return `${method}:${url}:${JSON.stringify(params || {})}`;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Initialize performance monitoring
performanceMonitor.init();

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async config => {
    try {
      // Track API call performance
      config.startTime = performance.now();

      // Check cache for GET requests
      if (config.method === 'get' && isCacheableRequest(config.url)) {
        const cacheKey = generateCacheKey(config);
        const cachedResponse = apiCache.get(cacheKey);

        if (cachedResponse) {
          console.log(`[AXIOS] Using cached response for ${config.url}`);
          // Setting a property to skip the actual request in the response interceptor
          config.cached = true;
          config.cachedResponse = cachedResponse;
        }
      }

      // Sanitize request data to prevent XSS
      if (config.data && typeof config.data === 'object' && !config.skipSanitization) {
        console.log(`[AXIOS] Sanitizing request data for ${config.url}`);
        config.data = validation.sanitizeObject(config.data);
      }

      // Get token from secure storage
      const token = await secureStorage.getAuthToken();

      if (token) {
        // Set the Authorization header with Bearer prefix
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log(`[AXIOS] No auth token found for request to ${config.url}`);
      }

      // Add CSRF token for non-GET requests if not using Bearer token
      if (!token && !['GET', 'HEAD', 'OPTIONS'].includes(config.method?.toUpperCase())) {
        const csrfToken = getCSRFToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
      }

      // Ensure /api prefix for API requests, but exclude /uploads paths
      if (
        config.url &&
        !config.url.startsWith('/api') &&
        !config.url.startsWith('http') &&
        !config.url.startsWith('/uploads')
      ) {
        config.url = `/api${config.url}`;
      }

      return config;
    } catch (error) {
      console.error('[AXIOS] Error in request interceptor:', error);
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => {
    // Track API call performance
    if (response.config.startTime) {
      const endTime = performance.now();
      const duration = endTime - response.config.startTime;
      const endpoint = response.config.url || 'unknown';

      // Record API call metrics
      performanceMonitor.trackApiCall(endpoint, duration, {
        status: response.status,
        method: response.config.method,
        cached: !!response.config.cached,
      });
    }

    // If this is a cached response from the request interceptor
    if (response.config.cached && response.config.cachedResponse) {
      console.log(`[AXIOS] Returning cached response for ${response.config.url}`);
      return Promise.resolve(response.config.cachedResponse);
    }

    // Sanitize response data to protect against XSS
    if (response.data && typeof response.data === 'object' && !response.config.skipSanitization) {
      // Skip sanitization for specific response types (like binary data, files)
      const contentType = response.headers['content-type'] || '';
      if (
        !contentType.includes('application/octet-stream') &&
        !contentType.includes('image/') &&
        !contentType.includes('multipart/form-data')
      ) {
        console.log(`[AXIOS] Sanitizing response data from ${response.config.url}`);
        response.data = validation.sanitizeObject(response.data);
      }
    }

    // Cache successful GET responses that match our cacheable URLs
    if (response.config.method === 'get' && isCacheableRequest(response.config.url)) {
      const cacheKey = generateCacheKey(response.config);
      // Use different TTLs based on content type
      const ttl = response.config.url.includes('/blog') ? 60000 : 300000; // 1 min for blog, 5 mins for others
      apiCache.set(cacheKey, response, ttl);
      console.log(`[AXIOS] Cached response for ${response.config.url}`);
    }

    return response;
  },
  async error => {
    // Track API call performance even for errors
    if (error.config?.startTime) {
      const endTime = performance.now();
      const duration = endTime - error.config.startTime;
      const endpoint = error.config.url || 'unknown';

      // Record API call metrics with error information
      performanceMonitor.trackApiCall(endpoint, duration, {
        status: error.response?.status || 'network-error',
        method: error.config.method,
        error: error.message,
      });
    }

    const originalRequest = error.config;

    // Clear cache for failed cacheable requests to prevent stale data
    if (originalRequest?.method === 'get' && isCacheableRequest(originalRequest.url)) {
      const cacheKey = generateCacheKey(originalRequest);
      apiCache.delete(cacheKey);
    }

    // If we get a 401 response
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await axiosInstance.post('/auth/refresh-token');
        const { token } = response.data;

        if (token) {
          // Store the new token
          await secureStorage.setAuthToken(token);
          // Update headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Process any queued requests
          processQueue(null, token);

          // Retry the original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth data on refresh failure
        await secureStorage.clearAuth();
        delete axiosInstance.defaults.headers.common['Authorization'];

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Add methods to clear cache programmatically
axiosInstance.clearCache = (url = null) => {
  if (url) {
    // Clear specific URL patterns
    const cacheStats = apiCache.getStats();
    cacheStats.items.forEach(key => {
      if (key.includes(url)) {
        apiCache.delete(key);
      }
    });
  } else {
    // Clear all cache
    apiCache.clear();
  }
};

// Add a method to skip sanitization for certain requests (e.g., file uploads)
axiosInstance.noSanitize = config => {
  return {
    ...config,
    skipSanitization: true,
  };
};

export default axiosInstance;
