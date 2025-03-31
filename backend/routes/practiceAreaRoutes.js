const express = require('express');
const practiceAreaController = require('../controllers/practiceAreaController');
const authController = require('../controllers/authController');
const upload = require('../utils/uploadConfig');

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
router.post('/upload-image', upload.single('image'), practiceAreaController.uploadPracticeAreaImage);

module.exports = router;