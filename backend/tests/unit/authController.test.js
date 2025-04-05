const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const authController = require("../../controllers/authController");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Auth Controller", () => {
  describe("signup", () => {
    it("should create a new user and return token", async () => {
      const req = {
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          passwordConfirm: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.signup(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const jsonResponse = res.json.mock.calls[0][0];
      expect(jsonResponse.status).toBe("success");
      expect(jsonResponse.token).toBeDefined();
      expect(jsonResponse.data.user.name).toBe("Test User");
      expect(jsonResponse.data.user.email).toBe("test@example.com");
    });
  });

  describe("login", () => {
    it("should login user and return token", async () => {
      // Create a test user first
      const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        passwordConfirm: "password123",
      });

      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.login(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonResponse = res.json.mock.calls[0][0];
      expect(jsonResponse.status).toBe("success");
      expect(jsonResponse.token).toBeDefined();
    });

    it("should return error for invalid credentials", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "wrongpassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });
  });

  describe("protect", () => {
    it("should allow access with valid token", async () => {
      const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        passwordConfirm: "password123",
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const res = {};
      const next = jest.fn();

      await authController.protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.id).toEqual(user._id.toString());
    });

    it("should deny access without token", async () => {
      const req = {
        headers: {},
      };
      const res = {};
      const next = jest.fn();

      await authController.protect(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });
  });
});
