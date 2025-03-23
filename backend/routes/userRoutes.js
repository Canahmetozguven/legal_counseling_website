const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/me', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: req.user
  });
});

// Admin only routes
router.use(restrictTo('admin'));

module.exports = router;
