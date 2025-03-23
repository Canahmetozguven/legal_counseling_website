const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.getLawyers = async (req, res) => {
  try {
    // Find users with role 'lawyer' or any other role that should be considered lawyers
    const lawyers = await User.find({ 
      role: { $in: ['lawyer', 'admin'] } 
    });
    
    res.status(200).json({
      status: 'success',
      results: lawyers.length,
      data: {
        lawyers
      }
    });
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch lawyers'
    });
  }
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});