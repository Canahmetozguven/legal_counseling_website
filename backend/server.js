const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: './config.env' });

// Validate configuration before starting
const { validateConfig } = require('./utils/configValidator');

try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error.message);
  process.exit(1);
}

// Import app after environment variables are loaded
const app = require('./app');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});