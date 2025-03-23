import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Set token in axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Try to fetch the current user data
        const response = await axios.get('/api/auth/me');
        if (response.data && response.data.data) {
          setUser(response.data.data);
        } else {
          // If response doesn't contain user data, clear token
          logout();
        }
      } else {
        // No token found, ensure user is logged out
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    
    // Check response structure and extract token
    const token = response.data.token;
    const userData = response.data.data ? response.data.data.user : null;
    
    if (token) {
      // Store token and set in headers
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store user data
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return response.data;
    } else {
      throw new Error('No token received from server');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const register = async (userData) => {
    const response = await axios.post('/api/auth/signup', userData);
    return response.data;
  };

  const value = {
    user,
    isAuthenticated: !!localStorage.getItem('token'), // Check token existence for auth status
    login,
    logout,
    register,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
