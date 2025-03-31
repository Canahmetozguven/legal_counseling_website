import axiosInstance from './axiosConfig';
import secureStorage from '../utils/secureStorage';

const authService = {
  login: async (email, password) => {
    try {
      console.log('[AUTH DEBUG] Login request payload:', { email });
      
      const response = await axiosInstance.post('/auth/login', { email, password });
      
      console.log('[AUTH DEBUG] Login response:', response.data);
      
      if (response.data.token) {
        console.log('[AUTH] Login successful, storing token');
        // Store auth data securely
        await secureStorage.setAuthData(response.data.token, response.data.data?.user || {});
        
        // Set authorization header for all future requests
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('[AUTH] Token stored and authorization header set');
      } else {
        console.warn('[AUTH] Login response missing token');
      }
      
      return response.data;
    } catch (error) {
      console.error('[AUTH] Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      console.log('[AUTH] Server logout successful');
    } catch (error) {
      console.warn('[AUTH] Server logout error:', error.response?.data || error.message);
    } finally {
      // Always clear local auth data
      await secureStorage.clearAuth();
      delete axiosInstance.defaults.headers.common['Authorization'];
      console.log('[AUTH] Local auth data cleared');
    }
  },

  // Initialize auth state from storage - call this when app loads
  initAuth: async () => {
    try {
      const token = await secureStorage.getAuthToken();
      console.log('[AUTH] Checking stored token:', token ? 'Found' : 'Not found');
      
      if (token) {
        // Set the Authorization header
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token is still valid
        try {
          await axiosInstance.get('/auth/me');
          console.log('[AUTH] Stored token is valid');
          return true;
        } catch (error) {
          // Try to refresh the token first
          try {
            const refreshResponse = await axiosInstance.post('/auth/refresh-token');
            if (refreshResponse.data.token) {
              console.log('[AUTH] Token refreshed successfully');
              await secureStorage.setAuthToken(refreshResponse.data.token);
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse.data.token}`;
              return true;
            }
          } catch (refreshError) {
            console.log('[AUTH] Token refresh failed, clearing auth data');
            await secureStorage.clearAuth();
            delete axiosInstance.defaults.headers.common['Authorization'];
          }
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('[AUTH] Error initializing auth:', error);
      return false;
    }
  },

  getCurrentUser: async () => {
    return await secureStorage.getUser();
  },

  isAuthenticated: async () => {
    const token = await secureStorage.getAuthToken();
    return !!token;
  },

  refreshToken: async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token');
      if (response.data.token) {
        await secureStorage.setAuthToken(response.data.token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error('[AUTH] Token refresh failed:', error);
      return false;
    }
  }
};

export default authService;