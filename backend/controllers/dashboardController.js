const User = require("../models/userModel");
const Client = require("../models/clientModel");
const Contact = require("../models/contactModel");
const Case = require("../models/caseModel");
const Appointment = require("../models/appointmentModel");
const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");

// Controller to fetch dashboard data
exports.getDashboardData = catchAsync(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalClients = await Client.countDocuments();
  const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

  res.status(200).json({
    totalUsers,
    totalClients,
    recentContacts,
  });
});

// Get dashboard overview stats
exports.getDashboardStats = catchAsync(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Add case status aggregation
  const caseStatusAggregation = await Case.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Transform the aggregation result into a format for the pie chart
  const caseStatusCounts = {};
  caseStatusAggregation.forEach((item) => {
    caseStatusCounts[item._id] = item.count;
  });

  const [
    totalClients,
    totalCases,
    totalAppointments,
    totalPendingAppointments,
    activeClients,
    activeCases,
    monthlyAppointments,
    recentContacts,
  ] = await Promise.all([
    Client.countDocuments(),
    Case.countDocuments(),
    Appointment.countDocuments(),
    Appointment.countDocuments({
      date: { $gte: now },
      status: "scheduled",
    }),
    Client.countDocuments({ active: true }),
    Case.countDocuments({ status: { $in: ["open", "ongoing", "pending"] } }),
    Appointment.countDocuments({
      date: { $gte: startOfMonth, $lte: now },
    }),
    Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject status createdAt"),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      totalClients,
      totalCases,
      totalAppointments,
      totalPendingAppointments,
      activeClients,
      activeCases,
      monthlyAppointments,
      recentContacts,
      caseStatusCounts,
      lastUpdated: new Date(),
    },
  });
});
