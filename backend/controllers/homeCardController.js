const HomeCard = require('../models/homeCardModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all home cards
exports.getAllHomeCards = catchAsync(async (req, res, next) => {
  const cards = await HomeCard.find().sort({ order: 1 });
  
  res.status(200).json({
    status: 'success',
    results: cards.length,
    data: {
      homeCards: cards
    }
  });
});

// Get a single home card
exports.getHomeCard = catchAsync(async (req, res, next) => {
  const card = await HomeCard.findById(req.params.id);

  if (!card) {
    return next(new AppError('No card found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      homeCard: card
    }
  });
});

// Create a new home card
exports.createHomeCard = catchAsync(async (req, res, next) => {
  const newCard = await HomeCard.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      homeCard: newCard
    }
  });
});

// Update a home card
exports.updateHomeCard = catchAsync(async (req, res, next) => {
  const card = await HomeCard.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!card) {
    return next(new AppError('No card found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      homeCard: card
    }
  });
});

// Delete a home card
exports.deleteHomeCard = catchAsync(async (req, res, next) => {
  const card = await HomeCard.findByIdAndDelete(req.params.id);

  if (!card) {
    return next(new AppError('No card found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Update all home cards order
exports.updateCardsOrder = catchAsync(async (req, res, next) => {
  const { cards } = req.body;

  if (!Array.isArray(cards)) {
    return next(new AppError('Cards must be an array of objects', 400));
  }

  // Update each card's order
  const updatePromises = cards.map(card => {
    return HomeCard.findByIdAndUpdate(
      card.id, 
      { order: card.order },
      { new: true }
    );
  });

  await Promise.all(updatePromises);

  res.status(200).json({
    status: 'success',
    message: 'Cards order updated successfully'
  });
});

// Upload image for home card
exports.uploadHomeCardImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  // Return the filename of the uploaded image
  res.status(200).json({
    status: 'success',
    data: {
      filename: req.file.filename
    }
  });
});