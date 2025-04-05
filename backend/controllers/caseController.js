const Case = require("../models/caseModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Get all cases
exports.getAllCases = catchAsync(async (req, res, next) => {
  let filter = {};

  // If clientId is specified in the query, filter cases by client
  if (req.query.clientId) {
    filter.client = req.query.clientId;
  }

  const cases = await Case.find(filter);

  res.status(200).json({
    status: "success",
    results: cases.length,
    data: {
      cases,
    },
  });
});

// Get a specific case
exports.getCase = catchAsync(async (req, res, next) => {
  const caseDoc = await Case.findById(req.params.id).populate("appointments");

  if (!caseDoc) {
    return next(new AppError("No case found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      case: caseDoc,
    },
  });
});

// Create a new case
exports.createCase = catchAsync(async (req, res, next) => {
  // Set the assigned lawyer to the current user if not specified
  if (!req.body.assignedLawyer) {
    req.body.assignedLawyer = req.user.id;
  }

  const newCase = await Case.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      case: newCase,
    },
  });
});

// Update a case
exports.updateCase = catchAsync(async (req, res, next) => {
  const caseDoc = await Case.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!caseDoc) {
    return next(new AppError("No case found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      case: caseDoc,
    },
  });
});

// Delete a case
exports.deleteCase = catchAsync(async (req, res, next) => {
  const caseDoc = await Case.findByIdAndDelete(req.params.id);

  if (!caseDoc) {
    return next(new AppError("No case found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get cases for the current lawyer
exports.getMyCases = catchAsync(async (req, res, next) => {
  const cases = await Case.find({ assignedLawyer: req.user.id });

  res.status(200).json({
    status: "success",
    results: cases.length,
    data: {
      cases,
    },
  });
});

// Add a document to a case
exports.addCaseDocument = catchAsync(async (req, res, next) => {
  const caseDoc = await Case.findById(req.params.id);

  if (!caseDoc) {
    return next(new AppError("No case found with that ID", 404));
  }

  caseDoc.documents.push(req.body);
  await caseDoc.save();

  res.status(200).json({
    status: "success",
    data: {
      case: caseDoc,
    },
  });
});

// Add a note to a case
exports.addCaseNote = catchAsync(async (req, res, next) => {
  const caseDoc = await Case.findById(req.params.id);

  if (!caseDoc) {
    return next(new AppError("No case found with that ID", 404));
  }

  const note = {
    content: req.body.content,
    author: req.user.id,
    date: new Date(),
  };

  caseDoc.notes.push(note);
  await caseDoc.save();

  res.status(200).json({
    status: "success",
    data: {
      case: caseDoc,
    },
  });
});
