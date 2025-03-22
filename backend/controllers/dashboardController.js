const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/userModel');
const Client = require('../models/clientModel');
const Contact = require('../models/contactModel');

// Controller to fetch dashboard data
exports.getDashboardData = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalClients = await Client.countDocuments();
  const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

  res.status(200).json({
    totalUsers,
    totalClients,
    recentContacts,
  });
});