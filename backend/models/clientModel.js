const mongoose = require('mongoose');
const validator = require('validator');

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide client first name']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide client last name']
  },
  email: {
    type: String,
    required: [true, 'Please provide client email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide client phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  idNumber: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  dateOfBirth: Date,
  notes: String,
  active: {
    type: Boolean,
    default: true
  },
  assignedLawyer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for cases
clientSchema.virtual('cases', {
  ref: 'Case',
  foreignField: 'client',
  localField: '_id'
});

// Virtual populate for appointments
clientSchema.virtual('appointments', {
  ref: 'Appointment',
  foreignField: 'client',
  localField: '_id'
});

// Query middleware to exclude inactive clients
clientSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// Query middleware to populate lawyer details when retrieving a client
clientSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'assignedLawyer',
    select: 'name email'
  });
  next();
});

// Create fullName virtual property
clientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;