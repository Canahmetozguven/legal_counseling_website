const PracticeArea = require("../models/practiceAreaModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllPracticeAreas = catchAsync(async (req, res, next) => {
  const practiceAreas = await PracticeArea.find().sort("order");

  res.status(200).json({
    status: "success",
    results: practiceAreas.length,
    data: {
      practiceAreas,
    },
  });
});

exports.getPracticeArea = catchAsync(async (req, res, next) => {
  const practiceArea = await PracticeArea.findById(req.params.id);

  if (!practiceArea) {
    return next(new AppError("No practice area found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      practiceArea,
    },
  });
});

exports.createPracticeArea = catchAsync(async (req, res, next) => {
  const newPracticeArea = await PracticeArea.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      practiceArea: newPracticeArea,
    },
  });
});

exports.updatePracticeArea = catchAsync(async (req, res, next) => {
  const practiceArea = await PracticeArea.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!practiceArea) {
    return next(new AppError("No practice area found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      practiceArea,
    },
  });
});

exports.deletePracticeArea = catchAsync(async (req, res, next) => {
  const practiceArea = await PracticeArea.findByIdAndDelete(req.params.id);

  if (!practiceArea) {
    return next(new AppError("No practice area found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Handle image uploads for practice areas
exports.uploadPracticeAreaImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }

  // Return the filename of the uploaded image
  res.status(200).json({
    status: "success",
    data: {
      imagePath: req.file.filename,
    },
  });
});
