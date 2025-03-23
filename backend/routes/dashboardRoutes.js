const express = require('express');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// Protect all dashboard routes
router.use(authController.protect);

// Dashboard statistics and data
router.get('/stats', dashboardController.getDashboardStats);
router.get('/data', dashboardController.getDashboardData);

module.exports = router;