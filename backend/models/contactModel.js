const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: String,
  subject: {
    type: String,
    required: [true, 'Please provide a subject']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message']
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'responded', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  response: {
    content: String,
    date: Date,
    by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'referral', 'other'],
    default: 'website'
  },
  convertedToClient: {
    type: Boolean,
    default: false
  },
  clientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client'
  },
  notes: String
}, {
  timestamps: true
});

// Indexes for faster queries
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ assignedTo: 1 });

// Populate the assignedTo field
contactSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'assignedTo',
    select: 'name email'
  });
  
  if (this._mongooseOptions.populate && this._mongooseOptions.populate.clientId) {
    this.populate({
      path: 'clientId',
      select: 'firstName lastName email'
    });
  }
  
  next();
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;