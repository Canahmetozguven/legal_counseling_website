/**
 * Configuration validation utility
 * Ensures that all required environment variables are set
 */

const validateConfig = () => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'MONGODB_URI',
    'NODE_ENV'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    envVar => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }

  // Validate JWT expiration format
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const validExpiresInFormat = /^\d+[dhms]$/.test(expiresIn); // Format like 90d, 24h, 60m, 60s
  
  if (!validExpiresInFormat) {
    throw new Error(
      'JWT_EXPIRES_IN must be in a valid format (e.g. 90d, 24h, 60m, 60s)'
    );
  }

  // Validate JWT_SECRET strength - at least 32 characters recommended
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('WARNING: JWT_SECRET should be at least 32 characters long for security');
  }
};

module.exports = { validateConfig };