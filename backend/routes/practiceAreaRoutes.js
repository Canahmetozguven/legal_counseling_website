const express = require('express');
const practiceAreaController = require('../controllers/practiceAreaController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', practiceAreaController.getAllPracticeAreas);
router.get('/:id', practiceAreaController.getPracticeArea);

// Protect and restrict all admin routes
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post('/', practiceAreaController.createPracticeArea);
router.patch('/:id', practiceAreaController.updatePracticeArea);
router.delete('/:id', practiceAreaController.deletePracticeArea);

module.exports = router;