import React from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';
import { useNotification } from '../../contexts/NotificationContext';

/**
 * NotificationSnackbar
 *
 * Renders notification messages from the NotificationContext as Material UI Snackbars
 * Supports multiple notifications stacked vertically
 */
const NotificationSnackbar = () => {
  const { notifications, dismissNotification } = useNotification();

  const handleClose = id => (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dismissNotification(id);
  };

  return (
    <Stack spacing={2} sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}>
      {(notifications || []).map(notification => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration}
          onClose={handleClose(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ position: 'relative', mb: 1 }}
        >
          <Alert
            onClose={() => dismissNotification(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default NotificationSnackbar;
