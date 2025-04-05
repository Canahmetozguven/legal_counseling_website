/**
 * Runtime Performance Monitoring Utility
 *
 * Tracks key performance metrics at runtime to identify bottlenecks
 * and performance issues in the application.
 */

import React from 'react';
import monitoring from './monitoring';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      interactions: {},
      renders: {},
      apiCalls: {},
      longTasks: [],
    };

    // Check if we're in production environment safely
    this.enabled =
      typeof window !== 'undefined' && window.env && window.env.NODE_ENV === 'production';
    this.initialized = false;
  }

  /**
   * Initialize the performance monitor
   */
  init() {
    if (this.initialized) return;

    // Only monitor in browsers with performance API support
    if (typeof window !== 'undefined' && window.performance) {
      console.log('[Performance] Initializing performance monitoring');

      // Set up long task observer if supported
      if ('PerformanceObserver' in window) {
        try {
          const longTaskObserver = new PerformanceObserver(list => {
            list.getEntries().forEach(entry => {
              // Track tasks that block the main thread for more than 50ms
              if (entry.duration > 50) {
                this.trackLongTask(entry);
              }
            });
          });

          longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (error) {
          console.warn('[Performance] Long task monitoring not supported', error);
        }
      }

      this.initialized = true;
    }
  }

  /**
   * Track the start of a user interaction
   * @param {string} name - Name of the interaction
   * @param {object} details - Additional details about the interaction
   * @returns {Function} - Function to call when interaction completes
   */
  trackInteractionStart(name, details = {}) {
    const start = performance.now();
    const id = `${name}_${Date.now()}`;

    return () => {
      const duration = performance.now() - start;
      this.trackInteractionComplete(name, duration, { ...details, id });
    };
  }

  /**
   * Track a completed interaction
   * @param {string} name - Name of the interaction
   * @param {number} duration - Duration in milliseconds
   * @param {object} details - Additional details
   */
  trackInteractionComplete(name, duration, details = {}) {
    if (!this.metrics.interactions[name]) {
      this.metrics.interactions[name] = [];
    }

    const interactionData = {
      duration,
      timestamp: Date.now(),
      ...details,
    };

    this.metrics.interactions[name].push(interactionData);

    // Log slow interactions (> 100ms)
    if (duration > 100) {
      console.warn(`[Performance] Slow interaction: ${name} took ${duration.toFixed(2)}ms`);

      if (this.enabled) {
        monitoring.trackInteraction('slow-interaction', {
          name,
          duration,
          details,
        });
      }
    }

    // Keep only the last 10 interactions per type
    if (this.metrics.interactions[name].length > 10) {
      this.metrics.interactions[name].shift();
    }
  }

  /**
   * Track component render time
   * @param {string} componentName - Name of the component
   * @param {number} duration - Duration in milliseconds
   */
  trackRender(componentName, duration) {
    if (!this.metrics.renders[componentName]) {
      this.metrics.renders[componentName] = [];
    }

    this.metrics.renders[componentName].push({
      duration,
      timestamp: Date.now(),
    });

    // Log slow renders (> 16ms - which would cause frame drops)
    if (duration > 16) {
      console.warn(`[Performance] Slow render: ${componentName} took ${duration.toFixed(2)}ms`);

      if (this.enabled) {
        monitoring.trackInteraction('slow-render', {
          component: componentName,
          duration,
        });
      }
    }

    // Keep only the last 10 renders per component
    if (this.metrics.renders[componentName].length > 10) {
      this.metrics.renders[componentName].shift();
    }
  }

  /**
   * Track API call performance
   * @param {string} endpoint - API endpoint
   * @param {number} duration - Duration in milliseconds
   * @param {object} details - Additional details
   */
  trackApiCall(endpoint, duration, details = {}) {
    if (!this.metrics.apiCalls[endpoint]) {
      this.metrics.apiCalls[endpoint] = [];
    }

    this.metrics.apiCalls[endpoint].push({
      duration,
      timestamp: Date.now(),
      ...details,
    });

    // Log slow API calls (> 1000ms)
    if (duration > 1000) {
      console.warn(`[Performance] Slow API call: ${endpoint} took ${duration.toFixed(2)}ms`);

      if (this.enabled) {
        monitoring.trackInteraction('slow-api-call', {
          endpoint,
          duration,
          details,
        });
      }
    }

    // Keep only the last 10 calls per endpoint
    if (this.metrics.apiCalls[endpoint].length > 10) {
      this.metrics.apiCalls[endpoint].shift();
    }
  }

  /**
   * Track long tasks that block the main thread
   * @param {PerformanceEntry} entry - Long task performance entry
   */
  trackLongTask(entry) {
    const taskInfo = {
      duration: entry.duration,
      startTime: entry.startTime,
      name: entry.name,
      timestamp: Date.now(),
    };

    this.metrics.longTasks.push(taskInfo);

    console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`);

    if (this.enabled) {
      monitoring.trackInteraction('long-task', taskInfo);
    }

    // Keep only the last 20 long tasks
    if (this.metrics.longTasks.length > 20) {
      this.metrics.longTasks.shift();
    }
  }

  /**
   * Create a render timing HOC for React components
   * @param {React.Component} Component - Component to track
   * @returns {React.Component} - Wrapped component with performance tracking
   */
  withRenderTracking(Component) {
    const displayName = Component.displayName || Component.name || 'Component';
    const self = this;

    class PerformanceTrackedComponent extends React.Component {
      constructor(props) {
        super(props);
        this.renderStart = null;
      }

      componentDidMount() {
        this.renderStart = performance.now();
      }

      componentDidUpdate() {
        const renderTime = performance.now() - this.renderStart;
        self.trackRender(displayName, renderTime);
        this.renderStart = performance.now();
      }

      render() {
        return <Component {...this.props} />;
      }
    }

    // Set the displayName properly
    PerformanceTrackedComponent.displayName = `WithPerformanceTracking(${displayName})`;

    return PerformanceTrackedComponent;
  }

  /**
   * Create a React hook for measuring render performance
   * @param {string} componentName - Name of the component to track
   * @returns {Function} - Custom hook for render timing
   */
  useRenderTiming(componentName) {
    const self = this; // Store reference to the PerformanceMonitor instance

    // Return a custom hook function
    return function useRenderTimingHook() {
      // Using React.useMemo properly in a functional component context
      // eslint-disable-next-line react-hooks/exhaustive-deps
      return React.useMemo(() => {
        let startTime;

        return {
          startMeasure: () => {
            startTime = performance.now();
          },
          endMeasure: () => {
            if (startTime) {
              const duration = performance.now() - startTime;
              self.trackRender(componentName, duration);
            }
          },
        };
      }, []); // Remove componentName from dependency array since it's from outer scope
    };
  }

  /**
   * Get all performance metrics
   * @returns {Object} - Collected performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      summary: this.getSummary(),
    };
  }

  /**
   * Get a summary of performance issues
   * @returns {Object} - Summary of performance issues
   */
  getSummary() {
    const summary = {
      slowInteractions: 0,
      slowRenders: 0,
      slowApiCalls: 0,
      longTasks: this.metrics.longTasks.length,
    };

    // Count slow interactions
    Object.keys(this.metrics.interactions).forEach(name => {
      summary.slowInteractions += this.metrics.interactions[name].filter(
        interaction => interaction.duration > 100
      ).length;
    });

    // Count slow renders
    Object.keys(this.metrics.renders).forEach(name => {
      summary.slowRenders += this.metrics.renders[name].filter(
        render => render.duration > 16
      ).length;
    });

    // Count slow API calls
    Object.keys(this.metrics.apiCalls).forEach(endpoint => {
      summary.slowApiCalls += this.metrics.apiCalls[endpoint].filter(
        call => call.duration > 1000
      ).length;
    });

    return summary;
  }

  /**
   * Reset all metrics
   */
  resetMetrics() {
    this.metrics = {
      interactions: {},
      renders: {},
      apiCalls: {},
      longTasks: [],
    };
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
