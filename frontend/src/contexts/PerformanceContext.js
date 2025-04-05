import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// Create context
const PerformanceContext = createContext({
  metrics: {},
  recordMetric: () => {},
  clearMetrics: () => {},
});

// Custom hook for easy context usage
export const usePerformance = () => useContext(PerformanceContext);

// Provider component
export const PerformanceProvider = ({ children }) => {
  const [metrics, setMetrics] = useState({
    pageLoads: {},
    apiCalls: {},
    renderTimes: {},
  });

  // Record navigation timing when component mounts
  useEffect(() => {
    if (window.performance && process.env.NODE_ENV === 'development') {
      const timing = window.performance.timing;
      const navigationStart = timing.navigationStart;

      const timingMetrics = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        connection: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        domLoaded: timing.domContentLoadedEventEnd - navigationStart,
        windowLoaded: timing.loadEventEnd - navigationStart,
      };

      setMetrics(prev => ({
        ...prev,
        navigationTiming: timingMetrics,
      }));
    }
  }, []);

  // Function to record a performance metric
  const recordMetric = useCallback((category, name, value) => {
    setMetrics(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: value,
      },
    }));
  }, []);

  // Function to clear metrics
  const clearMetrics = useCallback(() => {
    setMetrics({
      pageLoads: {},
      apiCalls: {},
      renderTimes: {},
    });
  }, []);

  const contextValue = {
    metrics,
    recordMetric,
    clearMetrics,
  };

  return <PerformanceContext.Provider value={contextValue}>{children}</PerformanceContext.Provider>;
};

PerformanceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PerformanceContext;
