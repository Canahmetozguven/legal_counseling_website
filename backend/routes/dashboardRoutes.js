const express = require('express');
const { protect } = require('../controllers/authController');
const { getDashboardData, getDashboardStats } = require('../controllers/dashboardController');

const router = express.Router();

router.use(protect); // Protect all dashboard routes

router.get('/data', getDashboardData);
router.get('/stats', getDashboardStats);

module.exports = router;