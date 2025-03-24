const About = require('../models/aboutModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get about content including team members
exports.getAboutContent = catchAsync(async (req, res, next) => {
  const about = await About.findOne();
  
  if (!about) {
    return next(new AppError('About content not found', 404));
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
  const about = await About.findOne();
  
  if (!about) {
    return next(new AppError('Team members not found', 404));
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
  const about = await About.findOne();
  
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