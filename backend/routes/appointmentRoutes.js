const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Get my appointments route
router.get('/my-appointments', appointmentController.getMyAppointments);

// Get recent appointments
router.get('/recent', appointmentController.getRecentAppointments);

// Standard CRUD routes
router
  .route('/')
  .get(authController.restrictTo('admin', 'lawyer'), appointmentController.getAllAppointments)
  .post(appointmentController.createAppointment);

router
  .route('/:id')
  .get(appointmentController.getAppointment)
  .patch(appointmentController.updateAppointment)
  .delete(appointmentController.deleteAppointment);

module.exports = router;