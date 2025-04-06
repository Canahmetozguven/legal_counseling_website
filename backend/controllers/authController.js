const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwtErrorHandler = require("../utils/jwtErrorHandler");
const securityLogger = require("../utils/securityLogger");

// Create JWT token with enhanced security
const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  return jwt.sign(
    {
      id,
      // Add random identifier to prevent token reuse across sessions
      jti: crypto.randomBytes(16).toString("hex"),
      // Add issued at timestamp to help with token revocation
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      algorithm: "HS256", // Explicitly set the algorithm
    }
  );
};

// Create and send token with response - enhanced security
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // Set cookie options with enhanced security
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 ||
          7 * 24 * 60 * 60 * 1000) // Default to 7 days if not specified
    ),
    httpOnly: true, // Cookie cannot be accessed by client-side JS
    sameSite: "strict", // Protection against CSRF attacks
    secure: req.secure || req.headers["x-forwarded-proto"] === "https", // Only send over HTTPS
  };

  // Send cookie
  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// Register new user
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 201, req, res);
});

// Login user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    // Log failed login attempt with missing credentials
    securityLogger.logAuthAttempt(
      false,
      null,
      email || "not provided",
      req.ip,
      req.headers["user-agent"],
      { reason: "Missing credentials" }
    );
    return next(new AppError("Please provide email and password", 400));
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    // Log failed login attempt with invalid credentials
    securityLogger.logAuthAttempt(
      false,
      user ? user._id : null,
      email,
      req.ip,
      req.headers["user-agent"],
      { reason: "Invalid credentials" }
    );
    return next(new AppError("Incorrect email or password", 401));
  }

  // Log successful login
  securityLogger.logAuthAttempt(
    true,
    user._id,
    email,
    req.ip,
    req.headers["user-agent"]
  );

  // Send token to client
  createSendToken(user, 200, req, res);
});

// Logout user
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true,
    sameSite: "strict",
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  res.status(200).json({ status: "success" });
};

// Refresh token
exports.refreshToken = catchAsync(async (req, res, next) => {
  // 1) Get current user from token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new AppError("No token found", 401));
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
  });

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // 4) Create new token
  const newToken = signToken(currentUser._id);

  res.status(200).json({
    status: "success",
    token: newToken,
  });
});

// Protect routes - middleware to check if user is logged in
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  console.log("[AUTH DEBUG] Incoming token:", token?.substring(0, 10) + "...");
  console.log("[AUTH DEBUG] Request headers:", req.headers);

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access.", 401)
    );
  }

  try {
    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    console.log("[AUTH DEBUG] Token verification result:", decoded);

    console.log("Token successfully verified, decoded payload:", {
      id: decoded.id,
      iat: decoded.iat,
      jti: decoded.jti,
      exp: decoded.exp,
    });

    // 3) Check if user still exists
    let currentUser;
    console.log("[AUTH DEBUG] Decoded ID:", decoded.id);
    console.log("[AUTH DEBUG] Is valid ObjectId:", mongoose.Types.ObjectId.isValid(decoded.id));
    if (mongoose.Types.ObjectId.isValid(decoded.id)) {
      currentUser = await User.findById(decoded.id).select("+passwordChangedAt");
    } else {
      console.log("[AUTH DEBUG] Invalid user ID in token:", decoded.id);
      return next(new AppError("Invalid user ID in token", 400));
    }

    console.log("[AUTH DEBUG] User found:", currentUser?._id);

    if (!currentUser) {
      console.log("User not found for id:", decoded.id);
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // 4) If user's password was changed after token issuance
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      console.log(
        "Debug - currentUser.passwordChangedAt:",
        currentUser.passwordChangedAt,
        "decoded iat:",
        decoded.iat,
        "Password changed?:",
        decoded.iat < changedTimestamp
      );

      if (decoded.iat < changedTimestamp) {
        return next(
          new AppError(
            "User recently changed password. Please log in again.",
            401
          )
        );
      }
    }

    // Remove sensitive data
    delete currentUser.passwordChangedAt;

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    return jwtErrorHandler(error, req, res, next);
  }
});

// Restrict routes to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// Update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

// Get current user
exports.getMe = catchAsync(async (req, res, next) => {
  // User is already available on req.user from the protect middleware
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});
