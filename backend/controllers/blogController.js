const mongoose = require('mongoose');
const Blog = require('../models/blogModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all published blog posts
exports.getAllPublishedPosts = catchAsync(async (req, res, next) => {
  const filter = { status: 'published' };
  
  // Filter by category
  if (req.query.category) {
    filter.categories = { $in: [req.query.category] };
  }
  
  // Filter by tag
  if (req.query.tag) {
    filter.tags = { $in: [req.query.tag] };
  }

  const posts = await Blog.find(filter)
    .sort({ publishedAt: -1 });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts
    }
  });
});

// Get all blog posts (including drafts and archived) for admin/author
exports.getAllPosts = catchAsync(async (req, res, next) => {
  let filter = {};
  
  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  // Filter by author
  if (req.query.author) {
    filter.author = req.query.author;
  } else {
    // If not admin, only show own posts
    if (req.user.role !== 'admin') {
      filter.author = req.user.id;
    }
  }

  const posts = await Blog.find(filter)
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts
    }
  });
});

// Get a single blog post by ID or slug
exports.getPost = catchAsync(async (req, res, next) => {
  let post;
  
  // Check if the parameter is an ID or slug
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  
  if (isValidId) {
    post = await Blog.findById(req.params.id);
  } else {
    post = await Blog.findOne({ slug: req.params.id });
  }

  if (!post) {
    return next(new AppError('No blog post found with that ID or slug', 404));
  }

  // Increment view count if post is published and not the author viewing
  if (post.status === 'published' && (!req.user || req.user.id !== post.author.id)) {
    post.viewCount += 1;
    await post.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

// Create a new blog post
exports.createPost = catchAsync(async (req, res, next) => {
  // Set author to current user if not specified
  if (!req.body.author) {
    req.body.author = req.user.id;
  }

  const newPost = await Blog.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost
    }
  });
});

// Update a blog post
exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  // Check if user is author or admin
  if (post.author.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to edit this post', 403));
  }

  // Update the post
  const updatedPost = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      post: updatedPost
    }
  });
});

// Delete a blog post
exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  // Check if user is author or admin
  if (post.author.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this post', 403));
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Add a comment to a blog post
exports.addComment = catchAsync(async (req, res, next) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  // Create the comment
  const comment = {
    user: {
      name: req.body.name,
      email: req.body.email
    },
    content: req.body.content,
    // Auto-approve comments if the user is the author or admin
    isApproved: req.user && (req.user.id === post.author.id || req.user.role === 'admin')
  };

  post.comments.push(comment);
  await post.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    data: {
      comment
    }
  });
});

// Get all categories
exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Blog.distinct('categories');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

// Get all tags
exports.getTags = catchAsync(async (req, res, next) => {
  const tags = await Blog.distinct('tags');

  res.status(200).json({
    status: 'success',
    results: tags.length,
    data: {
      tags
    }
  });
});