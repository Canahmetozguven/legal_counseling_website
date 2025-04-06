const mongoose = require("mongoose");
const authController = require("../../controllers/authController");
const User = require("../../models/userModel");

// Use the common setup from setup.js
require('../setup');

// Mock the User model to prevent actual database operations in unit tests
jest.mock("../../models/userModel");

describe("Auth Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request, response, and next function
    req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        passwordConfirm: "password123",
      },
      headers: {},
      cookies: {},
      protocol: "http",
      get: jest.fn().mockReturnValue("localhost"),
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
  });

  describe("signup", () => {
    it("should create a new user and return token", async () => {
      // Mock the User.create method to return a user with the proper structure
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: "user",
        toObject: jest.fn().mockReturnValue({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          email: req.body.email,
          role: "user",
        }),
      };
      
      User.create.mockResolvedValue(mockUser);
      
      // Create a working mock for authController.createSendToken
      const originalCreateSendToken = authController.createSendToken;
      authController.createSendToken = jest.fn().mockImplementation((user, statusCode, req, res) => {
        res.status(statusCode).json({
          status: "success",
          token: "test-token",
          data: { user },
        });
      });

      await authController.signup(req, res, next);
      
      expect(User.create).toHaveBeenCalledWith({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      });
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      
      // Restore the original method
      authController.createSendToken = originalCreateSendToken;
    });
  });

  describe("login", () => {
    it("should login user and return token", async () => {
      // Setup the mock user implementation
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: req.body.password,
        correctPassword: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
        }),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      
      // Create a working mock for authController.createSendToken
      const originalCreateSendToken = authController.createSendToken;
      authController.createSendToken = jest.fn().mockImplementation((user, statusCode, req, res) => {
        res.status(statusCode).json({
          status: "success",
          token: "test-token",
          data: { user },
        });
      });

      await authController.login(req, res, next);
      
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(mockUser.correctPassword).toHaveBeenCalledWith(
        req.body.password,
        mockUser.password
      );
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      // Restore the original method
      authController.createSendToken = originalCreateSendToken;
    });

    it("should return error for invalid credentials", async () => {
      // Setup user not found scenario
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await authController.login(req, res, next);
      
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Incorrect email or password");
    });
  });

  describe("protect", () => {
    it("should allow access with valid token", async () => {
      // Create a user for the test
      const userId = new mongoose.Types.ObjectId();
      const user = {
        _id: userId,
        email: "test@example.com",
        role: "user",
      };

      // Mock the token verification process
      req.headers.authorization = "Bearer valid-token";
      
      // Mock the jwt.verify function used inside authController.protect
      const jwt = require("jsonwebtoken");
      jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
        callback(null, { id: userId }); // Mock successful verification
      });
      
      // Mock User.findById to return our test user
      User.findById = jest.fn().mockResolvedValue(user);

      await authController.protect(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user._id).toEqual(user._id);
    });

    it("should deny access without token", async () => {
      await authController.protect(req, res, next);
      
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("You are not logged in! Please log in to get access.");
    });
  });
});
