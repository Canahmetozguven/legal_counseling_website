const mongoose = require('mongoose');
const Blog = require('../models/blogModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all blog posts (for admin)
exports.getAllPosts = catchAsync(async (req, res) => {
  const posts = await Blog.find()
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    data: posts
  });
});

// Get published blog posts (for public)
exports.getPublishedPosts = catchAsync(async (req, res) => {
  const filter = { status: 'published' };
  
  if (req.query.category) {
    filter.categories = { $in: [req.query.category] };
  }
  
  if (req.query.tag) {
    filter.tags = { $in: [req.query.tag] };
  }

  const posts = await Blog.find(filter)
    .sort({ publishedAt: -1 });

  res.status(200).json({
    status: 'success',
    data: posts
  });
});

// Get single blog post
exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // Increment view count if not author
  if (!req.user || req.user._id.toString() !== post.author.toString()) {
    post.analytics.views += 1;
    await post.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: 'success',
    data: post
  });
});

// Create blog post
exports.createPost = catchAsync(async (req, res) => {
  const newPost = await Blog.create({
    ...req.body,
    author: req.user._id,
    status: 'draft'
  });

  res.status(201).json({
    status: 'success',
    data: newPost
  });
});

// Update blog post
exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: post
  });
});

// Delete blog post
exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Blog.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get all tags
exports.getTags = catchAsync(async (req, res) => {
  const tags = await Blog.distinct('tags');

  res.status(200).json({
    status: 'success',
    data: tags
  });
});

// Like a post
exports.likePost = catchAsync(async (req, res, next) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  post.analytics.likes += 1;
  await post.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: post
  });
});

// Share a post
exports.sharePost = catchAsync(async (req, res, next) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  post.analytics.shares += 1;
  await post.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: post
  });
});

// Add a comment
exports.addComment = catchAsync(async (req, res, next) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  post.comments.push({
    author: {
      name: req.body.name,
      email: req.body.email
    },
    content: req.body.content,
    isApproved: req.user?.role === 'admin' // Auto-approve if admin
  });

  await post.save();

  res.status(201).json({
    status: 'success',
    data: post.comments[post.comments.length - 1]
  });
});

// Approve a comment
exports.approveComment = catchAsync(async (req, res, next) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  const comment = post.comments.id(req.params.commentId);
  
  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  comment.isApproved = true;
  await post.save();

  res.status(200).json({
    status: 'success',
    data: comment
  });
});

// Delete a comment
exports.deleteComment = catchAsync(async (req, res, next) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  post.comments.id(req.params.commentId).deleteOne();
  await post.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get blog analytics
exports.getBlogAnalytics = catchAsync(async (req, res) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // Get historical data (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const lastMonth = await Blog.findById(req.params.id)
    .select('analytics')
    .lean();

  // For demo purposes, generate some random daily data
  const daily = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString(),
      views: Math.floor(Math.random() * 100)
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      current: post.analytics,
      lastMonth: lastMonth.analytics,
      daily
    }
  });
});