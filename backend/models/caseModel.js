const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: [true, 'A case must have a number'],
    unique: true
  },
  title: {
    type: String,
    required: [true, 'A case must have a title']
  },
  description: {
    type: String,
    required: [true, 'A case must have a description']
  },
  caseType: {
    type: String,
    required: [true, 'Please specify case type'],
    enum: ['criminal', 'civil', 'family', 'corporate', 'property', 'labor', 'other']
  },
  status: {
    type: String,
    required: [true, 'A case must have a status'],
    enum: ['open', 'ongoing', 'pending', 'closed', 'won', 'lost', 'settled', 'appealed'],
    default: 'open'
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: [true, 'A case must belong to a client']
  },
  assignedLawyer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A case must have an assigned lawyer']
  },
  opposingParty: {
    name: String,
    contactInfo: String,
    lawyer: String
  },
  courtDetails: {
    name: String,
    location: String,
    judge: String,
    caseNumber: String
  },
  filingDate: {
    type: Date,
    default: Date.now
  },
  hearingDates: [Date],
  nextHearing: Date,
  documents: [{
    title: String,
    description: String,
    fileUrl: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [
    {
      content: String,
      author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  fees: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'partially-paid', 'unpaid'],
      default: 'unpaid'
    },
    invoices: [
      {
        invoiceNumber: String,
        amount: Number,
        issueDate: Date,
        dueDate: Date,
        status: {
          type: String,
          enum: ['paid', 'unpaid', 'overdue'],
          default: 'unpaid'
        }
      }
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
caseSchema.index({ caseNumber: 1 });
caseSchema.index({ client: 1 });
caseSchema.index({ status: 1 });
caseSchema.index({ assignedLawyer: 1 });

// Populate middleware
caseSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'client',
    select: 'firstName lastName email phone'
  }).populate({
    path: 'assignedLawyer',
    select: 'name email'
  });
  next();
});

// Virtual field for case age
caseSchema.virtual('caseAge').get(function() {
  const now = new Date();
  const filingDate = this.filingDate;
  const diffTime = Math.abs(now - filingDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual populate for appointments related to this case
caseSchema.virtual('appointments', {
  ref: 'Appointment',
  foreignField: 'caseId',
  localField: '_id'
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;