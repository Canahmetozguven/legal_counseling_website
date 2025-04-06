import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

/**
 * Error Boundary component that catches JavaScript errors in child components,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    this.logError(error, errorInfo);
    this.setState({ errorInfo });
  }

  logError = (error, errorInfo) => {
    // Log to console in development
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // In production, you'd want to send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      // Example for future integration with error monitoring service
      // errorMonitoringService.captureError(error, { extra: errorInfo });

      // For now, let's log to localStorage for debugging
      const errorLog = JSON.parse(localStorage.getItem('error_log') || '[]');
      errorLog.push({
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        url: window.location.href,
      });

      // Keep only the last 10 errors
      while (errorLog.length > 10) {
        errorLog.shift();
      }

      localStorage.setItem('error_log', JSON.stringify(errorLog));
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback UI if provided
      if (fallback) {
        return typeof fallback === 'function' ? fallback(error, this.handleReset) : fallback;
      }

      // Default fallback UI
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            minHeight: '300px',
            p: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'error.light',
              borderRadius: 2,
            }}
          >
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We&apos;re sorry, but there was an error loading this content. Please try refreshing the
              page or contact support if the issue persists.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button variant="outlined" onClick={this.handleReset}>
                Try Again
              </Button>
            </Box>

            {process.env.NODE_ENV !== 'production' && error && (
              <Box sx={{ mt: 4, textAlign: 'left', overflow: 'auto', maxHeight: 200 }}>
                <Typography variant="subtitle2" color="error">
                  Error details (visible in development only):
                </Typography>
                <pre
                  style={{
                    fontSize: '0.85rem',
                    backgroundColor: '#f5f5f5',
                    padding: '8px',
                    borderRadius: '4px',
                    overflow: 'auto',
                  }}
                >
                  {error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default ErrorBoundary;
