const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A blog post must have a title'],
    trim: true,
    maxlength: [200, 'A blog title cannot exceed 200 characters']
  },
  slug: String,
  content: {
    type: String,
    required: [true, 'A blog post must have content']
  },
  excerpt: {
    type: String,
    required: [true, 'A blog post must have an excerpt'],
    maxlength: [500, 'An excerpt cannot exceed 500 characters']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A blog post must have an author']
  },
  coverImage: {
    type: String,
    default: 'default-blog-cover.jpg'
  },
  categories: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  viewCount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  comments: [
    {
      user: {
        name: String,
        email: String
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      isApproved: {
        type: Boolean,
        default: false
      }
    }
  ]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  
  // Set publishedAt date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  next();
});

// Populate author details when querying blog posts
blogSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name'
  });
  next();
});

// Virtual property for reading time
blogSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Indexes for faster queries
blogSchema.index({ slug: 1 });
blogSchema.index({ categories: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;