import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// Create context with default values
const NotificationContext = createContext({
  notification: null,
  showNotification: () => {},
  hideNotification: () => {},
});

// Custom hook for easy context usage
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, options = {}) => {
    const { severity = 'info', duration = 5000 } = options;

    setNotification({
      message,
      severity,
      duration,
      open: true,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // Success notification shorthand
  const showSuccessNotification = useCallback(
    (message, options = {}) => {
      showNotification(message, { ...options, severity: 'success' });
    },
    [showNotification]
  );

  // Error notification shorthand
  const showErrorNotification = useCallback(
    (message, options = {}) => {
      showNotification(message, { ...options, severity: 'error' });
    },
    [showNotification]
  );

  // Warning notification shorthand
  const showWarningNotification = useCallback(
    (message, options = {}) => {
      showNotification(message, { ...options, severity: 'warning' });
    },
    [showNotification]
  );

  // Info notification shorthand
  const showInfoNotification = useCallback(
    (message, options = {}) => {
      showNotification(message, { ...options, severity: 'info' });
    },
    [showNotification]
  );

  const contextValue = {
    notification,
    showNotification,
    hideNotification,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationContext;
