const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  content: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A blog post must have a title'],
    trim: true,
    maxlength: [200, 'A blog title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'A blog post must have content']
  },
  summary: {
    type: String,
    required: [true, 'A blog post must have a summary'],
    maxlength: [500, 'A summary cannot exceed 500 characters']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A blog post must have an author']
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  featuredImage: {
    url: String,
    caption: String,
    altText: String
  },
  publishedAt: {
    type: Date
  },
  comments: [commentSchema],
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to set publishedAt date when status changes to published
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtual for estimated reading time
blogSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Indexes for better query performance
blogSchema.index({ title: 'text', summary: 'text' });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ 'analytics.views': -1 });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;