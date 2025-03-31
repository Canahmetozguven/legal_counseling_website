import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../api/authService';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const isValid = await authService.initAuth();
        
        if (isValid) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
          console.log('[AUTH] Authentication initialized successfully');
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('[AUTH] Error initializing authentication:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.data.user);
      setIsAuthenticated(true);
      console.log('[AUTH] Login successful, updating context');
      return response;
    } catch (error) {
      console.error('[AUTH] Login failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      console.log('[AUTH] Logout complete, context updated');
    }
  };

  // This function will be used to check authentication status when needed
  const checkAuthStatus = async () => {
    try {
      const token = await authService.getAuthToken();
      const isValid = !!token;
      
      // Update state if it doesn't match current status
      if (isValid !== isAuthenticated) {
        setIsAuthenticated(isValid);
      }
      
      return isValid;
    } catch (error) {
      console.error('[AUTH] Error checking auth status:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated, // Now a boolean state, not a function
    loading,
    login,
    logout,
    checkAuthStatus // Expose this function separately if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
