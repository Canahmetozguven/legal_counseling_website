const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/published', blogController.getAllPublishedPosts);
router.get('/categories', blogController.getCategories);
router.get('/tags', blogController.getTags);
router.get('/:id', blogController.getPost);

// Protected routes - Require authentication
router.use(authController.protect);

// Admin/Author only routes
router.get('/', blogController.getAllPosts);
router.post('/', blogController.createPost);
router.patch('/:id', blogController.updatePost);
router.delete('/:id', blogController.deletePost);

// Comments
router.post('/:id/comments', blogController.addComment);

module.exports = router;