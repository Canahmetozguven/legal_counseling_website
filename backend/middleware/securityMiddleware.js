const Tokens = require("csrf");
const AppError = require("../utils/appError");
const securityLogger = require("../utils/securityLogger");

// Initialize CSRF token generator with persistent secret
const tokens = new Tokens();
const secret = process.env.CSRF_SECRET || tokens.secretSync();

// Store the secret if it was generated
if (!process.env.CSRF_SECRET) {
  process.env.CSRF_SECRET = secret;
}

// CSRF Protection middleware
exports.csrfProtection = (req, res, next) => {
  // Skip CSRF check for GET, HEAD, OPTIONS requests as they should be idempotent
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Skip CSRF check if using Bearer token authentication
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return next();
  }

  // Get token from request header or form field
  const token =
    req.headers["x-csrf-token"] ||
    req.headers["x-xsrf-token"] ||
    req.body._csrf;

  if (!token) {
    securityLogger.logCsrfViolation(req);
    return next(new AppError("CSRF token missing", 403));
  }

  // Verify token
  if (!tokens.verify(secret, token)) {
    securityLogger.logSecurityIncident(
      "CSRF Attack",
      "Invalid CSRF token provided",
      req.ip,
      {
        path: req.path,
        method: req.method,
        headers: {
          origin: req.headers.origin,
          referer: req.headers.referer,
        },
      }
    );
    return next(new AppError("Invalid CSRF token", 403));
  }

  next();
};

// Generate CSRF token and attach it to the response
exports.generateCsrfToken = (req, res, next) => {
  const token = tokens.create(secret);

  // Set CSRF token in a cookie with enhanced security
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false, // Client-side JS needs to read this
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7200000, // 2 hours
  });

  // Also attach to response header for non-browser clients
  res.setHeader("X-CSRF-Token", token);

  next();
};

// Additional security headers middleware
exports.additionalSecurityHeaders = (req, res, next) => {
  // Prevent browser from sniffing MIME types
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Strict-Transport-Security for HTTPS enforcing
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Add Permissions-Policy header
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), camera=(), microphone=(), payment=(), usb=(), " +
      "magnetometer=(), accelerometer=(), gyroscope=(), " +
      "interest-cohort=()"
  );

  next();
};

// Enhanced request sanitizer middleware
exports.sanitizeRequest = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value !== "string") return value;

    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "removed:")
      .replace(/data:/gi, "removed:")
      .replace(/on\w+=/gi, "removed=")
      .replace(/eval\((.*?)\)/gi, "")
      .replace(/expression\((.*?)\)/gi, "")
      .replace(new RegExp("<%|%>|<\\?|\\?>|{{|}}", "g"), "");
  };

  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        obj[key] = sanitizeValue(obj[key]);
      } else if (typeof obj[key] === "object") {
        obj[key] = sanitizeObject(obj[key]);
      }
    });

    return obj;
  };

  // Sanitize request parameters
  req.params = sanitizeObject(req.params);
  req.query = sanitizeObject(req.query);
  req.body = sanitizeObject(req.body);

  next();
};
