const request = require("supertest");
const app = require("../../app"); // Import app instead of server
const User = require("../../models/userModel");

// Use the common setup from setup.js
require('../setup');

describe("Auth Endpoints", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    passwordConfirm: "password123", // Added passwordConfirm field
    role: "lawyer",
  };

  // Clean up before each test to prevent duplicate user errors
  beforeEach(async () => {
    await User.deleteMany({ email: testUser.email });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.data.user.email).toBe(testUser.email);
    }, 80000); // Increased timeout for this specific test

    it("should not register user with existing email", async () => {
      // Create user first
      await User.create(testUser);

      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("already in use");
    }, 80000); // Increased timeout for this specific test
  });

  describe("POST /api/auth/login", () => {
    let createdUser;

    beforeAll(async () => {
      // Create a user for login tests
      createdUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        passwordConfirm: "password123", // Added passwordConfirm field
        role: "lawyer",
      });
    });

    afterAll(async () => {
      await User.deleteOne({ _id: createdUser._id });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should not login with invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain("Incorrect email or password");
    }, 80000); // Increased timeout for this specific test
  });
});
