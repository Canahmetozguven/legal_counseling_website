/**
 * Security Logger Utility
 * Provides specialized logging for security-related events
 */

const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Custom format for logs
const logFormat = printf(({ level, message, timestamp, metadata }) => {
  return `${timestamp} [${level}]: ${message} ${metadata ? JSON.stringify(metadata) : ''}`;
});

// Create security logger instance
const securityLogger = createLogger({
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    // Console output for development
    new transports.Console({
      format: combine(
        colorize(),
        logFormat
      ),
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    }),
    // File output for permanent records - separate files by severity
    new transports.File({
      filename: path.join(logsDir, 'security-error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 10
    }),
    new transports.File({
      filename: path.join(logsDir, 'security.log'),
      level: 'info',
      maxsize: 10485760, // 10MB
      maxFiles: 10
    })
  ],
  // Don't exit on handled exceptions
  exitOnError: false
});

// Helper functions for common security events
module.exports = {
  // Log authentication attempts
  logAuthAttempt: (success, userId, email, ip, userAgent, metadata = {}) => {
    const level = success ? 'info' : 'warn';
    securityLogger.log({
      level,
      message: `Authentication attempt: ${success ? 'SUCCESS' : 'FAILED'} for user ${email || 'unknown'}`,
      metadata: {
        userId,
        email,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  },

  // Log access control events
  logAccessControl: (success, userId, resource, action, ip, metadata = {}) => {
    const level = success ? 'info' : 'warn';
    securityLogger.log({
      level,
      message: `Access control: ${success ? 'GRANTED' : 'DENIED'} for ${action} on ${resource}`,
      metadata: {
        userId,
        resource,
        action,
        ip,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  },

  // Log security incident (high-severity event that needs attention)
  logSecurityIncident: (type, description, ip, metadata = {}) => {
    securityLogger.log({
      level: 'error',
      message: `SECURITY INCIDENT: ${type} - ${description}`,
      metadata: {
        ip,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  },

  // Log CSRF attacks
  logCsrfViolation: (req) => {
    securityLogger.log({
      level: 'warn',
      message: 'CSRF validation failed',
      metadata: {
        ip: req.ip,
        method: req.method,
        path: req.path,
        headers: {
          origin: req.headers.origin,
          referer: req.headers.referer,
          host: req.headers.host
        },
        timestamp: new Date().toISOString()
      }
    });
  },

  // Log rate limit events
  logRateLimit: (req, limit, windowMs) => {
    securityLogger.log({
      level: 'warn',
      message: 'Rate limit exceeded',
      metadata: {
        ip: req.ip,
        method: req.method,
        path: req.path,
        limit,
        windowMs,
        timestamp: new Date().toISOString()
      }
    });
  },

  // Generic security log method
  log: (level, message, metadata = {}) => {
    securityLogger.log({
      level,
      message,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    });
  }
};