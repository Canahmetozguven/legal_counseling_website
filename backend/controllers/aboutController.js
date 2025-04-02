const About = require('../models/aboutModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get about content including team members
exports.getAboutContent = catchAsync(async (req, res, next) => {
  // Find the about document, or create a default one if it doesn't exist
  let about = await About.findOne();
  
  if (!about) {
    // Instead of returning 404, create a default about document
    about = await About.create({
      mission: 'Our mission statement',
      values: ['Integrity', 'Excellence', 'Client-Focused'],
      history: 'Our company history',
      teamMembers: []
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      about
    }
  });
});

// Update about content
exports.updateAboutContent = catchAsync(async (req, res, next) => {
  const about = await About.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true,
    upsert: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      about
    }
  });
});

// Get team members
exports.getTeamMembers = catchAsync(async (req, res, next) => {
  let about = await About.findOne();
  
  if (!about) {
    // Create a default about document instead of returning 404
    about = await About.create({
      mission: 'Our mission statement',
      values: ['Integrity', 'Excellence', 'Client-Focused'],
      history: 'Our company history',
      teamMembers: []
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      teamMembers: about.teamMembers.sort((a, b) => a.order - b.order)
    }
  });
});

// Add team member
exports.addTeamMember = catchAsync(async (req, res, next) => {
  let about = await About.findOne();
  
  if (!about) {
    about = new About({ teamMembers: [] });
  }

  about.teamMembers.push(req.body);
  await about.save();

  res.status(201).json({
    status: 'success',
    data: {
      teamMember: about.teamMembers[about.teamMembers.length - 1]
    }
  });
});

// Update team member
exports.updateTeamMember = catchAsync(async (req, res, next) => {
  const about = await About.findOne();
  
  if (!about) {
    return next(new AppError('Team not found', 404));
  }

  const teamMember = about.teamMembers.id(req.params.memberId);
  
  if (!teamMember) {
    return next(new AppError('Team member not found', 404));
  }

  Object.assign(teamMember, req.body);
  await about.save();

  res.status(200).json({
    status: 'success',
    data: {
      teamMember
    }
  });
});

// Delete team member
exports.deleteTeamMember = catchAsync(async (req, res, next) => {
  const about = await About.findOne();
  
  if (!about) {
    return next(new AppError('Team not found', 404));
  }

  const teamMember = about.teamMembers.id(req.params.memberId);
  
  if (!teamMember) {
    return next(new AppError('Team member not found', 404));
  }

  teamMember.deleteOne();
  await about.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Upload team member image
exports.uploadTeamMemberImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }

  // Log the req.file object for debugging
  console.log('Uploaded file details:', req.file);

  // Construct the full path for the uploaded image
  const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  // Log the constructed imagePath for debugging
  console.log('Constructed image path:', imagePath);

  res.status(200).json({
    status: 'success',
    data: {
      imagePath
    }
  });
});