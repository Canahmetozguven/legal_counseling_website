const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");

// Use the common setup from setup.js
require('../setup');

describe("Auth Endpoints", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
    passwordConfirm: "password123", // Add passwordConfirm to fix validation
    name: "Test User",
  };

  beforeEach(async () => {
    // Clean up users before each test
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe(testUser.email);
    });

    it("should not register user with existing email", async () => {
      await User.create(testUser);

      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create(testUser);
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
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
    });
  });
});
