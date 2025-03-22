import axiosInstance from './axiosConfig';

const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  signup: async (userData) => {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  updatePassword: async (currentPassword, password, passwordConfirm) => {
    const response = await axiosInstance.patch('/auth/update-password', {
      passwordCurrent: currentPassword,
      password,
      passwordConfirm
    });
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;