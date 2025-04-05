const express = require("express");
const homeCardController = require("../controllers/homeCardController");
const authController = require("../controllers/authController");
const upload = require("../utils/uploadConfig");

const router = express.Router();

// Public route for getting all home cards
router.get("/", homeCardController.getAllHomeCards);

// Protected routes for admin operations
router.use(authController.protect, authController.restrictTo("admin"));

// Upload route - must be before routes with URL parameters
router.post(
  "/upload-image",
  upload.single("image"),
  homeCardController.uploadHomeCardImage
);

router.route("/").post(homeCardController.createHomeCard);

router.patch("/order", homeCardController.updateCardsOrder);

router
  .route("/:id")
  .get(homeCardController.getHomeCard)
  .patch(homeCardController.updateHomeCard)
  .delete(homeCardController.deleteHomeCard);

module.exports = router;
