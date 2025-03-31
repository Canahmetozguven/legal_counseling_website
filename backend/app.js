const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const { csrfProtection, generateCsrfToken, additionalSecurityHeaders, sanitizeRequest } = require('./middleware/securityMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const caseRoutes = require('./routes/caseRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const blogRoutes = require('./routes/blogRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const practiceAreaRoutes = require('./routes/practiceAreaRoutes');
const aboutRoutes = require('./routes/aboutRoutes');

const app = express();

// Trust proxy to handle X-Forwarded-For header
app.set('trust proxy', 1);

// CORS configuration must come before other middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://frontend:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept', 
    'Origin', 
    'X-Requested-With', 
    'X-CSRF-Token', 
    'X-XSRF-Token'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-CSRF-Token'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security HTTP headers - must come early in middleware chain
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
      imgSrc: ["'self'", "data:", "blob:", "https://picsum.photos"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'no-referrer' },
  xssFilter: true,
  strictTransportSecurity: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
}));

// Add custom security headers
app.use(additionalSecurityHeaders);

// Rate limiting
const globalLimiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again later.',
  handler: (req, res, next, options) => {
    securityLogger.logRateLimit(req, options.max, options.windowMs);
    res.status(429).json({
      status: 'error',
      message: options.message
    });
  }
});

const authLimiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many authentication attempts, please try again in an hour!',
  handler: (req, res, next, options) => {
    securityLogger.logRateLimit(req, options.max, options.windowMs);
    res.status(429).json({
      status: 'error',
      message: options.message
    });
  }
});

// Apply rate limiting
app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Request sanitization - must come after body parsers
app.use(sanitizeRequest);
app.use(mongoSanitize()); // NoSQL query injection
app.use(xss()); // Cross-site scripting
app.use(hpp()); // HTTP Parameter Pollution

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CSRF Protection setup
// Generate tokens for routes that need it
app.use([
  '/api/contact',
  '/api/auth/register',
  '/api/auth/update-password',
  '/api/auth/reset-password',
  '/api/auth/forgot-password'
], generateCsrfToken);

// Apply CSRF protection to routes that need it
app.use([
  '/api/contact/submit',
  '/api/auth/register',
  '/api/auth/update-password',
  '/api/auth/reset-password',
  '/api/auth/forgot-password'
], csrfProtection);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/clients', clientRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/practice-areas', practiceAreaRoutes);
app.use('/api/about', aboutRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
