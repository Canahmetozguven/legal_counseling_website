import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';

const NotificationSnackbar = () => {
  const { notification, hideNotification } = useNotification();

  // Auto-hide the notification after the specified duration
  useEffect(() => {
    if (notification?.open) {
      const timer = setTimeout(() => {
        hideNotification();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification, hideNotification]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    hideNotification();
  };

  if (!notification) {
    return null;
  }

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={notification.duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.severity || 'info'}
        elevation={6}
        variant="filled"
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
