const Appointment = require('../models/appointmentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all appointments
exports.getAllAppointments = catchAsync(async (req, res, next) => {
  let filter = {};
  
  // Filter by client if provided
  if (req.query.client) {
    filter.client = req.query.client;
  }
  
  // Filter by case if provided
  if (req.query.caseId) {
    filter.caseId = req.query.caseId;
  }
  
  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    filter.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  } else if (req.query.startDate) {
    filter.date = { $gte: new Date(req.query.startDate) };
  } else if (req.query.endDate) {
    filter.date = { $lte: new Date(req.query.endDate) };
  }

  const appointments = await Appointment.find(filter).sort({ date: 1, startTime: 1 });

  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: {
      appointments
    }
  });
});

// Get a specific appointment
exports.getAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new AppError('No appointment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      appointment
    }
  });
});

// Create a new appointment
exports.createAppointment = catchAsync(async (req, res, next) => {
  // Set the lawyer to the current user if not specified
  if (!req.body.lawyer) {
    req.body.lawyer = req.user.id;
  }

  // Check for time conflicts
  const conflictingAppointment = await Appointment.findOne({
    lawyer: req.body.lawyer,
    date: new Date(req.body.date),
    $or: [
      {
        startTime: { $lte: req.body.startTime },
        endTime: { $gt: req.body.startTime }
      },
      {
        startTime: { $lt: req.body.endTime },
        endTime: { $gte: req.body.endTime }
      },
      {
        startTime: { $gte: req.body.startTime },
        endTime: { $lte: req.body.endTime }
      }
    ],
    status: { $nin: ['canceled', 'rescheduled'] }
  });

  if (conflictingAppointment) {
    return next(new AppError('There is a time conflict with another appointment', 400));
  }

  const newAppointment = await Appointment.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      appointment: newAppointment
    }
  });
});

// Update an appointment
exports.updateAppointment = catchAsync(async (req, res, next) => {
  // Check for time conflicts if changing date/time
  if (req.body.date || req.body.startTime || req.body.endTime) {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return next(new AppError('No appointment found with that ID', 404));
    }
    
    const date = req.body.date || appointment.date;
    const startTime = req.body.startTime || appointment.startTime;
    const endTime = req.body.endTime || appointment.endTime;
    const lawyer = req.body.lawyer || appointment.lawyer;
    
    const conflictingAppointment = await Appointment.findOne({
      _id: { $ne: req.params.id },
      lawyer,
      date: new Date(date),
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gt: startTime }
        },
        {
          startTime: { $lt: endTime },
          endTime: { $gte: endTime }
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ],
      status: { $nin: ['canceled', 'rescheduled'] }
    });

    if (conflictingAppointment) {
      return next(new AppError('There is a time conflict with another appointment', 400));
    }
  }

  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!appointment) {
    return next(new AppError('No appointment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      appointment
    }
  });
});

// Delete an appointment
exports.deleteAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!appointment) {
    return next(new AppError('No appointment found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get appointments for the current lawyer
exports.getMyAppointments = catchAsync(async (req, res, next) => {
  let filter = { lawyer: req.user.id };
  
  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    filter.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  } else if (req.query.startDate) {
    filter.date = { $gte: new Date(req.query.startDate) };
  } else if (req.query.endDate) {
    filter.date = { $lte: new Date(req.query.endDate) };
  }
  
  // Default to today's appointments if no date provided
  if (!req.query.startDate && !req.query.endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    filter.date = { $gte: today };
  }

  const appointments = await Appointment.find(filter).sort({ date: 1, startTime: 1 });

  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: {
      appointments
    }
  });
});