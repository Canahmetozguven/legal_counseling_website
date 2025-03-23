import axiosInstance from './axiosConfig';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  signup: async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response?.data);
      throw error;
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  updatePassword: async (currentPassword, password, passwordConfirm) => {
    try {
      const response = await axiosInstance.patch('/api/auth/update-password', {
        passwordCurrent: currentPassword,
        password,
        passwordConfirm
      });
      return response.data;
    } catch (error) {
      console.error('Password update error:', error.response?.data);
      throw error;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;