const Client = require("../models/clientModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Get all clients
exports.getAllClients = catchAsync(async (req, res, next) => {
  const clients = await Client.find();

  res.status(200).json({
    status: "success",
    results: clients.length,
    data: {
      clients,
    },
  });
});

// Get a specific client
exports.getClient = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.params.id).populate(
    "cases appointments"
  );

  if (!client) {
    return next(new AppError("No client found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      client,
    },
  });
});

// Create a new client
exports.createClient = catchAsync(async (req, res, next) => {
  // Set the assigned lawyer to the current user if not specified
  if (!req.body.assignedLawyer) {
    req.body.assignedLawyer = req.user.id;
  }

  const newClient = await Client.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      client: newClient,
    },
  });
});

// Update a client
exports.updateClient = catchAsync(async (req, res, next) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!client) {
    return next(new AppError("No client found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      client,
    },
  });
});

// Delete a client
exports.deleteClient = catchAsync(async (req, res, next) => {
  const client = await Client.findByIdAndDelete(req.params.id);

  if (!client) {
    return next(new AppError("No client found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get all clients assigned to the current lawyer
exports.getMyClients = catchAsync(async (req, res, next) => {
  const clients = await Client.find({ assignedLawyer: req.user.id });

  res.status(200).json({
    status: "success",
    results: clients.length,
    data: {
      clients,
    },
  });
});
