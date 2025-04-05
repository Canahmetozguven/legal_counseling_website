const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../server");
const User = require("../../models/userModel");
const Case = require("../../models/caseModel");
const Client = require("../../models/clientModel");

let mongoServer;
let token;
let testUser;
let testClient;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

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

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
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
        caseType: "employment",
        client: testClient._id,
        status: "active",
        priority: "high",
        courtDetails: {
          courtName: "Superior Court",
          caseNumber: "EC-2025-123",
        },
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
          client: testClient._id,
          assignedLawyer: testUser._id,
          status: "active",
        },
        {
          title: "Case 2",
          description: "Description 2",
          caseType: "criminal",
          client: testClient._id,
          assignedLawyer: testUser._id,
          status: "active",
        },
      ]);

      const response = await request(app)
        .get("/api/cases")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.cases.length).toBe(2);
    });

    it("should filter cases by status and type", async () => {
      await Case.create([
        {
          title: "Active Civil Case",
          description: "Description",
          caseType: "civil",
          client: testClient._id,
          assignedLawyer: testUser._id,
          status: "active",
        },
        {
          title: "Closed Criminal Case",
          description: "Description",
          caseType: "criminal",
          client: testClient._id,
          assignedLawyer: testUser._id,
          status: "closed",
        },
      ]);

      const response = await request(app)
        .get("/api/cases")
        .query({ status: "active", caseType: "civil" })
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
        client: testClient._id,
        assignedLawyer: testUser._id,
        status: "active",
      });

      const response = await request(app)
        .patch(`/api/cases/${testCase._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Title",
          status: "closed",
          resolution: "Case settled out of court",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.case.title).toBe("Updated Title");
      expect(response.body.data.case.status).toBe("closed");
      expect(response.body.data.case.resolution).toBe(
        "Case settled out of court"
      );
    });

    it("should only allow assigned lawyer to update case", async () => {
      const otherLawyer = await User.create({
        name: "Other Lawyer",
        email: "other@test.com",
        password: "password123",
        passwordConfirm: "password123",
        role: "lawyer",
      });

      const testCase = await Case.create({
        title: "Test Case",
        description: "Description",
        caseType: "civil",
        client: testClient._id,
        assignedLawyer: otherLawyer._id,
        status: "active",
      });

      const response = await request(app)
        .patch(`/api/cases/${testCase._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "closed",
        });

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/cases/:id/timeline", () => {
    it("should get case timeline", async () => {
      const testCase = await Case.create({
        title: "Timeline Test Case",
        description: "Description",
        caseType: "civil",
        client: testClient._id,
        assignedLawyer: testUser._id,
        status: "active",
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
        client: testClient._id,
        assignedLawyer: testUser._id,
        status: "active",
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
