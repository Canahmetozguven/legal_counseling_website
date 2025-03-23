const User = require('../models/userModel');
const Client = require('../models/clientModel');
const Contact = require('../models/contactModel');
const Case = require('../models/caseModel');
const Appointment = require('../models/appointmentModel');
const Blog = require('../models/blogModel');
const catchAsync = require('../utils/catchAsync');

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

exports.getDashboardStats = catchAsync(async (req, res) => {
  const [totalClients, totalCases, totalAppointments, totalBlogs] = await Promise.all([
    Client.countDocuments(),
    Case.countDocuments(),
    Appointment.countDocuments(),
    Blog.countDocuments()
  ]);

  res.status(200).json({
    totalClients,
    totalCases,
    totalAppointments,
    totalBlogs
  });
});