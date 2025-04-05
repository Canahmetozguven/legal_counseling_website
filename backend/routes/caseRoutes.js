const express = require("express");
const caseController = require("../controllers/caseController");
const authController = require("../controllers/authController");

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Get my cases route
router.get("/my-cases", caseController.getMyCases);

// Routes for case documents and notes
router.post("/:id/documents", caseController.addCaseDocument);
router.post("/:id/notes", caseController.addCaseNote);

// Standard CRUD routes
router
  .route("/")
  .get(authController.restrictTo("admin", "lawyer"), caseController.getAllCases)
  .post(caseController.createCase);

router
  .route("/:id")
  .get(caseController.getCase)
  .patch(caseController.updateCase)
  .delete(authController.restrictTo("admin"), caseController.deleteCase);

module.exports = router;
