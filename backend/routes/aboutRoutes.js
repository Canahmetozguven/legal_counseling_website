const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const aboutController = require('../controllers/aboutController');

const router = express.Router();

// Public routes
router.get('/', aboutController.getAboutContent);
router.get('/team', aboutController.getTeamMembers);

// Protected routes - only admin can modify content
router.use(protect);
router.use(restrictTo('admin'));

router.patch('/', aboutController.updateAboutContent);
router.post('/team', aboutController.addTeamMember);
router.patch('/team/:memberId', aboutController.updateTeamMember);
router.delete('/team/:memberId', aboutController.deleteTeamMember);

module.exports = router;