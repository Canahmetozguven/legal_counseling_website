import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';

/**
 * Enhanced lazy loading component with built-in error handling and loading states
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.importFn - Dynamic import function (e.g., () => import('./MyComponent'))
 * @param {React.Component} options.fallback - Fallback component to show while loading
 * @param {React.Component} options.errorFallback - Custom error component
 * @param {number} options.timeout - Timeout in milliseconds before showing a timeout message
 * @returns {React.Component} - Lazy-loaded component with error handling
 */
const createLazyComponent = ({
  importFn,
  fallback = null,
  errorFallback = null,
  timeout = 10000,
}) => {
  // Create lazy component with retry functionality
  const LazyComponentWithRetry = lazy(() => {
    return new Promise((resolve, reject) => {
      // Handle timeout
      const timeoutId = setTimeout(() => {
        reject(new Error('Component loading timed out'));
      }, timeout);

      // Try to load the component
      importFn()
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  });

  // Default loading component
  const DefaultLoadingFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%" minHeight={200}>
      <CircularProgress color="primary" />
    </Box>
  );

  // Default error fallback
  const DefaultErrorFallback = ({ error, resetErrorBoundary }) => (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={3}
      textAlign="center"
    >
      <Typography variant="h6" color="error" gutterBottom>
        Failed to load component
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        {error?.message || 'An unexpected error occurred'}
      </Typography>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary} sx={{ mt: 2 }}>
        Retry
      </Button>
    </Box>
  );

  DefaultErrorFallback.propTypes = {
    error: PropTypes.object,
    resetErrorBoundary: PropTypes.func.isRequired,
  };

  // Create the actual component
  const LazyComponent = props => (
    <ErrorBoundary
      fallback={(error, reset) =>
        errorFallback ? (
          errorFallback(error, reset)
        ) : (
          <DefaultErrorFallback error={error} resetErrorBoundary={reset} />
        )
      }
    >
      <Suspense fallback={fallback || <DefaultLoadingFallback />}>
        <LazyComponentWithRetry {...props} />
      </Suspense>
    </ErrorBoundary>
  );

  return LazyComponent;
};

export default createLazyComponent;

/**
 * Usage example:
 *
 * const LazyDashboard = createLazyComponent({
 *   importFn: () => import('../dashboard/Dashboard'),
 *   fallback: <CustomLoadingComponent />,
 *   timeout: 5000
 * });
 *
 * function App() {
 *   return (
 *     <div>
 *       <LazyDashboard prop1="value1" />
 *     </div>
 *   );
 * }
 */
