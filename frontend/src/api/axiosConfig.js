import axios from 'axios';
import secureStorage from '../utils/secureStorage';

// Create the base URL configuration
const baseURL = process.env.NODE_ENV === 'production' 
  ? '' 
  : `http://${window.location.hostname}:5000`;

console.log('[AXIOS] Initializing with baseURL:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 15000
});

// Helper function to get CSRF token from cookies
const getCSRFToken = () => {
  const csrfCookie = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('XSRF-TOKEN='));
  
  if (csrfCookie) {
    return csrfCookie.split('=')[1];
  }
  return null;
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

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get token from secure storage
      const token = await secureStorage.getAuthToken();
      
      if (token) {
        // Set the Authorization header with Bearer prefix
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[AXIOS] Request to ${config.url} with token`);
        console.log('[AXIOS DEBUG] Request URL:', config.url);
        console.log('[AXIOS DEBUG] Auth header:', config.headers.Authorization?.substring(0, 20) + '...');
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

      // Ensure /api prefix
      if (config.url && !config.url.startsWith('/api') && !config.url.startsWith('http')) {
        config.url = `/api${config.url}`;
      }

      return config;
    } catch (error) {
      console.error('[AXIOS] Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

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

export default axiosInstance;