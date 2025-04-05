const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const upload = require("../utils/uploadConfig");
const {
  getAllPosts,
  getPublishedPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getTags,
  likePost,
  sharePost,
  addComment,
  approveComment,
  deleteComment,
  getBlogAnalytics,
  uploadImage,
} = require("../controllers/blogController");

const router = express.Router();

// Public routes
router.get("/published", getPublishedPosts);
router.get("/tags", getTags);
router.get("/:id", getPost);
router.post("/:id/like", likePost);
router.post("/:id/share", sharePost);
router.post("/:id/comments", addComment);

// Protected routes
router.use(protect);

// Upload route - must be before the routes with URL parameters
router.post("/upload", upload.single("image"), uploadImage);

router.route("/").get(getAllPosts).post(createPost);

router.route("/:id").patch(updatePost).delete(deletePost);

// Admin only routes
router.use(restrictTo("admin"));

router.route("/:id/analytics").get(getBlogAnalytics);

router
  .route("/:id/comments/:commentId")
  .patch(approveComment)
  .delete(deleteComment);

module.exports = router;
