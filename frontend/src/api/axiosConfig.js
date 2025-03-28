import axios from 'axios';

const baseURL = 'http://backend:5000';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 15000
});

// Add a request interceptor to attach the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timeout:', error);
    }
    
    if (error.response?.status === 401) {
      console.error('Authentication error:', error.response?.data?.message || 'Unauthorized');
      localStorage.removeItem('token');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    if (error.response?.status === 500) {
      console.error('Server error:', error.response?.data?.message || 'Internal server error');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;