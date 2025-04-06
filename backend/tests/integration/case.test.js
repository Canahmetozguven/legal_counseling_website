const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app"); // Import app instead of server
const User = require("../../models/userModel");
const Case = require("../../models/caseModel");
const Client = require("../../models/clientModel");

// Use the common setup from setup.js
require('../setup');

let token;
let testUser;
let testClient;

beforeEach(async () => {
  // Create test user
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

  testClient = await Client.create({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
    assignedLawyer: testUser._id,
  });
});

beforeEach(async () => {
  await Case.deleteMany({});
});

describe("Case Routes", () => {
  describe("POST /api/cases", () => {
    it("should create a new case", async () => {
      const caseData = {
        title: "Employment Dispute",
        description: "Wrongful termination case",
        caseType: "labor",
        client: testClient._id,
        status: "open", // Updated to match enum values
        priority: "high",
        caseNumber: "EC-2025-123", // Added required field
        courtDetails: {
          courtName: "Superior Court",
          caseNumber: "EC-2025-123",
        },
        assignedLawyer: testUser._id, // Explicitly set assignedLawyer
      };

      const response = await request(app)
        .post("/api/cases")
        .set("Authorization", `Bearer ${token}`)
        .send(caseData);

      expect(response.status).toBe(201);
      expect(response.body.data.case.title).toBe(caseData.title);
      expect(response.body.data.case.assignedLawyer).toBe(
        testUser._id.toString()
      );
      expect(response.body.data.case.client).toBe(testClient._id.toString());
    });

    it("should not create case without required fields", async () => {
      const response = await request(app)
        .post("/api/cases")
        .set("Authorization", `Bearer ${token}`)
        .send({
          description: "Missing title and client...",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/cases", () => {
    it("should get all cases for logged-in lawyer", async () => {
      await Case.create([
        {
          title: "Case 1",
          description: "Description 1",
          caseType: "civil",
          caseNumber: "C-2025-001", // Added required field
          client: testClient._id,
          assignedLawyer: testUser._id,
          status: "open", // Updated to match enum values
        },
        {
          title: "Case 2",
          description: "Description 2",
          caseType: "criminal",
          caseNumber: "C-2025-002", // Added required field
          client: testClient._id,
          assignedLawyer: testUser._id,
          status: "open", // Updated to match enum values
        },
      ]);

      const response = await request(app)
        .get("/api/cases")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.cases.length).toBe(2);
    });

    it("should filter cases by status and type", async () => {
      // Create a case with open status and civil type
      await Case.create({
        title: "Active Civil Case",
        description: "Description",
        caseType: "civil", 
        caseNumber: "C-2025-003", // Added required field
        client: testClient._id,
        assignedLawyer: testUser._id,
        status: "open", // Updated to match enum values
      });

      // Create a case with closed status and criminal type
      await Case.create({
        title: "Closed Criminal Case",
        description: "Description",
        caseType: "criminal",
        caseNumber: "C-2025-004", // Added required field
        client: testClient._id,
        assignedLawyer: testUser._id,
        status: "closed", // This is a valid enum value
      });

      // Query specifically for open+civil cases - should only get one
      const response = await request(app)
        .get("/api/cases")
        .query({ status: "open", caseType: "civil" }) // Updated to match enum values
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.cases.length).toBe(1);
      expect(response.body.data.cases[0].title).toBe("Active Civil Case");
    });
  });

  describe("PATCH /api/cases/:id", () => {
    it("should update case details", async () => {
      const testCase = await Case.create({
        title: "Original Title",
        description: "Original description",
        caseType: "civil",
        caseNumber: "C-2025-005", // Added required field
        client: testClient._id,
        assignedLawyer: testUser._id,
        status: "open", // Updated to match enum values
      });

      const updateData = {
        title: "Updated Title",
        status: "closed",
        resolution: "Case settled out of court", // Ensure this field is included in the update
      };

      const response = await request(app)
        .patch(`/api/cases/${testCase._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.case.title).toBe("Updated Title");
      expect(response.body.data.case.status).toBe("closed");
      
      // Since the resolution field might not be returned directly in the response
      // We can modify the test to check if it exists, or fetch the case separately to verify
      const updatedCase = await Case.findById(testCase._id);
      expect(updatedCase.resolution).toBe("Case settled out of court");
    });

    it("should only allow assigned lawyer to update case", async () => {
      // Create another lawyer
      const otherLawyer = await User.create({
        name: "Other Lawyer",
        email: "other@test.com",
        password: "password123",
        passwordConfirm: "password123",
        role: "lawyer",
      });

      // Get token for the other lawyer
      const otherLoginResponse = await request(app).post("/api/auth/login").send({
        email: "other@test.com",
        password: "password123",
      });

      const otherLawyerToken = otherLoginResponse.body.token;

      // Create a case assigned to the original test lawyer
      const testCase = await Case.create({
        title: "Test Case",
        description: "Description",
        caseType: "civil",
        caseNumber: "C-2025-006", // Added required field
        client: testClient._id,
        assignedLawyer: testUser._id, // Assigned to testUser, not otherLawyer
        status: "open", // Updated to match enum values
      });

      // Try to update the case using the other lawyer's token
      const response = await request(app)
        .patch(`/api/cases/${testCase._id}`)
        .set("Authorization", `Bearer ${otherLawyerToken}`) // Using other lawyer's token
        .send({
          status: "closed",
        });

      // This should be forbidden since the other lawyer is not assigned to this case
      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/cases/:id/timeline", () => {
    it("should get case timeline", async () => {
      const testCase = await Case.create({
        title: "Timeline Test Case",
        description: "Description",
        caseType: "civil",
        caseNumber: "C-2025-007", // Added required field
        client: testClient._id,
        assignedLawyer: testUser._id,
        status: "open", // Updated to match enum values
        timeline: [
          {
            date: new Date(),
            action: "Case filed",
            description: "Initial case filing with the court",
          },
        ],
      });

      const response = await request(app)
        .get(`/api/cases/${testCase._id}/timeline`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.timeline.length).toBe(1);
      expect(response.body.data.timeline[0].action).toBe("Case filed");
    });
  });

  describe("POST /api/cases/:id/timeline", () => {
    it("should add timeline entry", async () => {
      const testCase = await Case.create({
        title: "Timeline Test Case",
        description: "Description",
        caseType: "civil",
        caseNumber: "C-2025-008", // Added required field
        client: testClient._id,
        assignedLawyer: testUser._id,
        status: "open", // Updated to match enum values
      });

      const timelineEntry = {
        action: "Court Hearing",
        description: "Preliminary hearing scheduled",
        date: new Date(),
      };

      const response = await request(app)
        .post(`/api/cases/${testCase._id}/timeline`)
        .set("Authorization", `Bearer ${token}`)
        .send(timelineEntry);

      expect(response.status).toBe(200);
      expect(response.body.data.timeline[0].action).toBe(timelineEntry.action);
      expect(response.body.data.timeline[0].description).toBe(
        timelineEntry.description
      );
    });
  });
});
