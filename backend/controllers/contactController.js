const Contact = require("../models/contactModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Get all contacts
exports.getAllContacts = catchAsync(async (req, res, next) => {
  let filter = {};

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Filter by assigned user
  if (req.query.assignedTo) {
    filter.assignedTo = req.query.assignedTo;
  }

  const contacts = await Contact.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: contacts.length,
    data: {
      contacts,
    },
  });
});

// Get a specific contact
exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new AppError("No contact found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});

// Create a new contact (public route)
exports.createContact = catchAsync(async (req, res, next) => {
  const newContact = await Contact.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    message: req.body.message,
    source: req.body.source || "website",
  });

  res.status(201).json({
    status: "success",
    data: {
      contact: newContact,
    },
  });
});

// Update a contact
exports.updateContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contact) {
    return next(new AppError("No contact found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});

// Delete a contact
exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new AppError("No contact found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Assign a contact to a user
exports.assignContact = catchAsync(async (req, res, next) => {
  if (!req.body.assignedTo) {
    return next(
      new AppError("Please provide a user ID to assign this contact to", 400)
    );
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    {
      assignedTo: req.body.assignedTo,
      status: "in-progress",
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("assignedTo");

  if (!contact) {
    return next(new AppError("No contact found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});

// Respond to a contact
exports.respondToContact = catchAsync(async (req, res, next) => {
  if (!req.body.content) {
    return next(new AppError("Please provide a response content", 400));
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    {
      response: {
        content: req.body.content,
        date: new Date(),
        by: req.user.id,
      },
      status: "responded",
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!contact) {
    return next(new AppError("No contact found with that ID", 404));
  }

  // Here you would typically send an email to the contact
  // This is a placeholder for that functionality

  res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});

// Convert a contact to a client
exports.convertToClient = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new AppError("No contact found with that ID", 404));
  }

  // Check if contact is already converted
  if (contact.convertedToClient) {
    return next(
      new AppError("This contact has already been converted to a client", 400)
    );
  }

  // Here you would typically create a new client
  // For now, we'll just mark the contact as converted
  contact.convertedToClient = true;
  contact.status = "closed";

  // If clientId is provided, link to the client
  if (req.body.clientId) {
    contact.clientId = req.body.clientId;
  }

  await contact.save();

  res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});
