/**
 * JWT error handling utility
 * Properly handles and categorizes different JWT-related errors
 */

const AppError = require('./appError');

module.exports = (err, req, res, next) => {
  // Handle JSON Web Token errors
  if (err.name === 'JsonWebTokenError') {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
  
  if (err.name === 'TokenExpiredError') {
    return next(new AppError('Your token has expired. Please log in again.', 401));
  }

  if (err.name === 'NotBeforeError') {
    return next(new AppError('Token not active yet. Please try again later.', 401));
  }

  // Handle any other JWT related errors
  if (err.message && err.message.includes('jwt')) {
    return next(new AppError('Authentication failed. Please log in again.', 401));
  }

  // Forward other errors to the next error handler
  next(err);
};