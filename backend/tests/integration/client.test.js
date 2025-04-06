const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app"); // Import app instead of server
const User = require("../../models/userModel");
const Client = require("../../models/clientModel");

// Use the common setup from setup.js
require('../setup');

let token;
let testUser;

beforeEach(async () => {
  // Create test user and get token
  testUser = await User.create({
    name: "Test Lawyer",
    email: "lawyer@test.com",
    password: "password123",
    passwordConfirm: "password123",
    role: "lawyer",
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: "lawyer@test.com",
    password: "password123",
  });

  token = loginResponse.body.token;
  
  // Clean up clients before each test
  await Client.deleteMany({});
});

describe("Client Routes", () => {
  describe("POST /api/clients", () => {
    it("should create a new client", async () => {
      const response = await request(app)
        .post("/api/clients")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "1234567890",
        });

      expect(response.status).toBe(201);
      expect(response.body.data.client.firstName).toBe("John");
      expect(response.body.data.client.lastName).toBe("Doe");
      expect(response.body.data.client.email).toBe("john@example.com");
    });

    it("should not create client without required fields", async () => {
      const response = await request(app)
        .post("/api/clients")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "John",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/clients", () => {
    it("should get all clients", async () => {
      // Create test clients
      await Client.create([
        {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "1234567890",
          assignedLawyer: testUser._id,
        },
        {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          phone: "0987654321",
          assignedLawyer: testUser._id,
        },
      ]);

      const response = await request(app)
        .get("/api/clients")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.clients.length).toBe(2);
    });
  });

  describe("GET /api/clients/:id", () => {
    it("should get client by ID", async () => {
      const client = await Client.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        assignedLawyer: testUser._id,
      });

      const response = await request(app)
        .get(`/api/clients/${client._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.client.email).toBe("john@example.com");
    });

    it("should return 404 for non-existent client", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/clients/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/clients/:id", () => {
    it("should update client", async () => {
      const client = await Client.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        assignedLawyer: testUser._id,
      });

      const response = await request(app)
        .patch(`/api/clients/${client._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Johnny",
          phone: "9999999999",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.client.firstName).toBe("Johnny");
      expect(response.body.data.client.phone).toBe("9999999999");
    });
  });
});
