const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../server");
const User = require("../../models/userModel");
const Client = require("../../models/clientModel");
const Appointment = require("../../models/appointmentModel");

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
  await Appointment.deleteMany({});
});

describe("Appointment Routes", () => {
  describe("POST /api/appointments", () => {
    it("should create a new appointment", async () => {
      const appointmentData = {
        client: testClient._id,
        date: new Date("2025-04-01T10:00:00.000Z"),
        duration: 60,
        type: "consultation",
        notes: "Initial consultation meeting",
      };

      const response = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send(appointmentData);

      expect(response.status).toBe(201);
      expect(response.body.data.appointment.client).toBe(
        testClient._id.toString()
      );
      expect(response.body.data.appointment.type).toBe("consultation");
      expect(new Date(response.body.data.appointment.date)).toEqual(
        appointmentData.date
      );
    });

    it("should not create appointment with invalid date", async () => {
      const response = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          client: testClient._id,
          date: "invalid-date",
          duration: 60,
          type: "consultation",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/appointments", () => {
    it("should get all appointments", async () => {
      // Create test appointments
      await Appointment.create([
        {
          client: testClient._id,
          date: new Date("2025-04-01T10:00:00.000Z"),
          duration: 60,
          type: "consultation",
          lawyer: testUser._id,
        },
        {
          client: testClient._id,
          date: new Date("2025-04-02T14:00:00.000Z"),
          duration: 30,
          type: "follow-up",
          lawyer: testUser._id,
        },
      ]);

      const response = await request(app)
        .get("/api/appointments")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.appointments.length).toBe(2);
    });

    it("should filter appointments by date range", async () => {
      await Appointment.create([
        {
          client: testClient._id,
          date: new Date("2025-04-01T10:00:00.000Z"),
          duration: 60,
          type: "consultation",
          lawyer: testUser._id,
        },
        {
          client: testClient._id,
          date: new Date("2025-05-01T14:00:00.000Z"),
          duration: 30,
          type: "follow-up",
          lawyer: testUser._id,
        },
      ]);

      const response = await request(app)
        .get("/api/appointments")
        .query({
          startDate: "2025-04-01",
          endDate: "2025-04-30",
        })
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.appointments.length).toBe(1);
      expect(new Date(response.body.data.appointments[0].date).getMonth()).toBe(
        3
      ); // April
    });
  });

  describe("PATCH /api/appointments/:id", () => {
    it("should update appointment", async () => {
      const appointment = await Appointment.create({
        client: testClient._id,
        date: new Date("2025-04-01T10:00:00.000Z"),
        duration: 60,
        type: "consultation",
        lawyer: testUser._id,
      });

      const response = await request(app)
        .patch(`/api/appointments/${appointment._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          duration: 90,
          notes: "Extended consultation needed",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.appointment.duration).toBe(90);
      expect(response.body.data.appointment.notes).toBe(
        "Extended consultation needed"
      );
    });
  });

  describe("DELETE /api/appointments/:id", () => {
    it("should delete appointment", async () => {
      const appointment = await Appointment.create({
        client: testClient._id,
        date: new Date("2025-04-01T10:00:00.000Z"),
        duration: 60,
        type: "consultation",
        lawyer: testUser._id,
      });

      const response = await request(app)
        .delete(`/api/appointments/${appointment._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      const deletedAppointment = await Appointment.findById(appointment._id);
      expect(deletedAppointment).toBeNull();
    });
  });
});
