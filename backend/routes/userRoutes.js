const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect routes that require authentication
router.use(authController.protect);

// Get all users
router.get('/', userController.getAllUsers);

// Get only lawyers
router.get('/lawyers', userController.getLawyers);

// Get specific user by ID
router.get('/:id', userController.getUser);

module.exports = router;
