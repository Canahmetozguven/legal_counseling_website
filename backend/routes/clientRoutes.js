const express = require('express');
const clientController = require('../controllers/clientController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Get my clients route
router.get('/my-clients', clientController.getMyClients);

// Standard CRUD routes
router
  .route('/')
  .get(authController.restrictTo('admin', 'lawyer'), clientController.getAllClients)
  .post(clientController.createClient);

router
  .route('/:id')
  .get(clientController.getClient)
  .patch(clientController.updateClient)
  .delete(authController.restrictTo('admin'), clientController.deleteClient);

module.exports = router;