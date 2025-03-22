const express = require('express');
const contactController = require('../controllers/contactController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public route for contact form submission
router.post('/', contactController.createContact);

// All other routes are protected
router.use(authController.protect);

// Routes for managing contacts
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContact);
router.patch('/:id', contactController.updateContact);
router.delete('/:id', authController.restrictTo('admin'), contactController.deleteContact);

// Special actions for contacts
router.patch('/:id/assign', contactController.assignContact);
router.patch('/:id/respond', contactController.respondToContact);
router.patch('/:id/convert', contactController.convertToClient);

module.exports = router;