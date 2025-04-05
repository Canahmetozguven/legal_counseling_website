import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import monitoring from './utils/monitoring';

// Initialize monitoring system
monitoring.init();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Report web vitals to monitoring system
reportWebVitals(({ name, value }) => {
  // Store the metric in monitoring
  monitoring.performanceMetrics[name.toLowerCase()] = value;

  // Log metrics in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Web Vital: ${name} = ${value}`);
  }
});
