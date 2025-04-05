/**
 * Application Monitoring Utility
 *
 * This utility provides functions to monitor application health, performance,
 * and errors. In production, it would integrate with a service like
 * LogRocket, Sentry, or New Relic.
 */

class Monitoring {
  constructor() {
    this.initialized = false;
    this.environment = process.env.NODE_ENV || 'development';
    this.performanceMetrics = {};
    this.sessionData = {
      startTime: Date.now(),
      pageViews: 0,
      errors: [],
      interactions: [],
    };

    // Track performance metrics
    if (typeof window !== 'undefined' && window.performance) {
      this.perfObserver = this.setupPerformanceObserver();
    }
  }

  /**
   * Initialize the monitoring system
   */
  init() {
    if (this.initialized) {
      return;
    }

    console.log('[Monitoring] Initializing monitoring in', this.environment);

    // Setup listeners for uncaught errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError);
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);

      // Track page views
      this.trackPageView(window.location.pathname);

      // Listen for route changes if using React Router
      const originalPushState = window.history.pushState;
      window.history.pushState = function () {
        const result = originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event('locationchange'));
        return result;
      };

      window.addEventListener('locationchange', () => {
        this.trackPageView(window.location.pathname);
      });
    }

    this.initialized = true;
  }

  /**
   * Setup Performance Observer to track performance metrics
   */
  setupPerformanceObserver() {
    if (!window.PerformanceObserver) {
      return null;
    }

    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          // Store performance metrics
          if (entry.entryType === 'largest-contentful-paint') {
            this.performanceMetrics.lcp = entry.startTime;
          }
          if (entry.entryType === 'first-input') {
            this.performanceMetrics.fid = entry.processingStart - entry.startTime;
          }
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            this.performanceMetrics.cls = (this.performanceMetrics.cls || 0) + entry.value;
          }
        });
      });

      // Observe core web vital metrics
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      observer.observe({ type: 'first-input', buffered: true });
      observer.observe({ type: 'layout-shift', buffered: true });

      return observer;
    } catch (error) {
      console.error('[Monitoring] Error setting up PerformanceObserver:', error);
      return null;
    }
  }

  /**
   * Handle global errors
   */
  handleGlobalError = event => {
    const { message, filename, lineno, colno, error } = event;
    this.captureError({
      type: 'global-error',
      message,
      source: filename,
      line: lineno,
      column: colno,
      stack: error?.stack,
    });
  };

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection = event => {
    const { reason } = event;
    this.captureError({
      type: 'unhandled-rejection',
      message: reason?.message || 'Unhandled Promise Rejection',
      stack: reason?.stack,
    });
  };

  /**
   * Capture and report an error
   */
  captureError(errorInfo) {
    console.error('[Monitoring] Error captured:', errorInfo);

    // Add to session data
    this.sessionData.errors.push({
      ...errorInfo,
      timestamp: Date.now(),
      url: window.location?.href,
    });

    // In production, send to error reporting service
    if (this.environment === 'production') {
      // Example implementation for future integration
      // this.sendToErrorService(errorInfo);

      // For now, store in localStorage for debugging
      this.persistErrorLog();
    }

    return errorInfo;
  }

  /**
   * Store errors in localStorage for debugging in production
   */
  persistErrorLog() {
    try {
      // Get existing log
      const existingLog = JSON.parse(localStorage.getItem('app_error_log') || '[]');

      // Add latest errors
      const updatedLog = [
        ...existingLog,
        ...this.sessionData.errors.slice(-5), // Keep only the last 5 errors from this session
      ].slice(-20); // Keep only the last 20 errors total

      localStorage.setItem('app_error_log', JSON.stringify(updatedLog));
    } catch (error) {
      console.error('[Monitoring] Error persisting error log:', error);
    }
  }

  /**
   * Track a page view
   */
  trackPageView(path) {
    this.sessionData.pageViews++;

    // Store timing information
    const pageLoadTime = window.performance?.now?.() || Date.now();

    const pageView = {
      path,
      timestamp: Date.now(),
      loadTime: pageLoadTime,
    };

    console.log('[Monitoring] Page view:', pageView);

    // In production, send to analytics service
    if (this.environment === 'production') {
      // Example implementation for future integration
      // this.sendToAnalyticsService('pageView', pageView);
    }
  }

  /**
   * Track a user interaction
   */
  trackInteraction(action, details = {}) {
    const interactionData = {
      action,
      timestamp: Date.now(),
      ...details,
    };

    this.sessionData.interactions.push(interactionData);

    // In production, send to analytics service
    if (this.environment === 'production' && this.sessionData.interactions.length % 10 === 0) {
      // Example implementation for future integration
      // this.sendToAnalyticsService('interactions', this.sessionData.interactions.slice(-10));
    }
  }

  /**
   * Get performance metrics for the current page
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      // Add navigation timing info if available
      navigationTiming: this.getNavigationTiming(),
      // Add memory info if available
      memory: window.performance?.memory
        ? {
            usedJSHeapSize: window.performance.memory.usedJSHeapSize,
            totalJSHeapSize: window.performance.memory.totalJSHeapSize,
          }
        : null,
    };
  }

  /**
   * Get navigation timing information
   */
  getNavigationTiming() {
    if (!window.performance || !window.performance.timing) {
      return null;
    }

    const timing = window.performance.timing;

    return {
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcpConnection: timing.connectEnd - timing.connectStart,
      serverResponse: timing.responseStart - timing.requestStart,
      domLoad: timing.domComplete - timing.domLoading,
      pageLoad: timing.loadEventEnd - timing.navigationStart,
    };
  }

  /**
   * Tear down the monitoring system
   */
  teardown() {
    if (!this.initialized) {
      return;
    }

    console.log('[Monitoring] Tearing down monitoring');

    // Remove event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('error', this.handleGlobalError);
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    }

    // Disconnect performance observer
    if (this.perfObserver) {
      this.perfObserver.disconnect();
    }

    this.initialized = false;
  }
}

// Create singleton instance
const monitoring = new Monitoring();

export default monitoring;
