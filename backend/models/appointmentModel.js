const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "An appointment must have a title"],
    },
    description: String,
    date: {
      type: Date,
      required: [true, "An appointment must have a date"],
    },
    startTime: {
      type: String,
      required: [true, "An appointment must have a start time"],
    },
    endTime: {
      type: String,
      required: [true, "An appointment must have an end time"],
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "Client",
      required: [true, "An appointment must belong to a client"],
    },
    lawyer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "An appointment must be assigned to a lawyer"],
    },
    caseId: {
      type: mongoose.Schema.ObjectId,
      ref: "Case",
    },
    location: {
      type: String,
      default: "Office",
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "canceled", "rescheduled"],
      default: "scheduled",
    },
    type: {
      type: String,
      enum: ["consultation", "meeting", "court", "deposition", "other"],
      default: "consultation",
    },
    reminders: [
      {
        type: {
          type: String,
          enum: ["email", "sms"],
          default: "email",
        },
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: Date,
      },
    ],
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ client: 1 });
appointmentSchema.index({ lawyer: 1 });
appointmentSchema.index({ caseId: 1 });

// Populate client and lawyer when finding appointments
appointmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "client",
    select: "firstName lastName email phone",
  }).populate({
    path: "lawyer",
    select: "name email",
  });

  // Only populate case if it exists
  this.populate({
    path: "caseId",
    select: "caseNumber title status",
  });

  next();
});

// Virtual property to check if appointment is upcoming
appointmentSchema.virtual("isUpcoming").get(function () {
  return new Date(this.date) > new Date();
});

// Virtual property to get full appointment time
appointmentSchema.virtual("fullTime").get(function () {
  return `${
    this.date.toISOString().split("T")[0]
  } ${this.startTime} - ${this.endTime}`;
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
