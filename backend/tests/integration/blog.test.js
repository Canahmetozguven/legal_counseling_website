const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app"); // Import app instead of server
const User = require("../../models/userModel");
const Blog = require("../../models/blogModel");

// Use the common setup from setup.js
require('../setup');

let token;
let testUser;

beforeEach(async () => {
  // Clear existing blogs
  await Blog.deleteMany({});

  // Create test user
  if (!testUser) {
    testUser = await User.create({
      name: "Test Lawyer",
      email: "lawyer@test.com",
      password: "password123",
      passwordConfirm: "password123",
      role: "lawyer",
    });
  }

  // Login and get token
  if (!token) {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "lawyer@test.com",
      password: "password123",
    });
    token = loginResponse.body.token;
  }
});

describe("Blog Routes", () => {
  describe("POST /api/blogs", () => {
    it("should create a new blog post", async () => {
      const blogData = {
        title: "Understanding Legal Rights",
        content: "This is a comprehensive guide about your legal rights...",
        summary: "A quick overview of legal rights and responsibilities", // Added required field
        tags: ["legal", "rights", "law"],
        author: testUser._id,
        status: "published",
      };

      const response = await request(app)
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(blogData);

      expect(response.status).toBe(201);
      expect(response.body.data.blog.title).toBe(blogData.title);
      expect(response.body.data.blog.summary).toBe(blogData.summary);
      expect(response.body.data.blog.author._id).toBe(testUser._id.toString());
      expect(response.body.data.blog.tags).toEqual(
        expect.arrayContaining(blogData.tags)
      );
    }, 80000); // Increased timeout for this test

    it("should not create blog post without required fields", async () => {
      const response = await request(app)
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "Missing title...",
        });

      expect(response.status).toBe(400);
    }, 80000); // Increased timeout for this test
  });

  describe("GET /api/blogs", () => {
    it("should get all published blog posts", async () => {
      await Blog.create([
        {
          title: "Blog Post 1",
          content: "Content 1",
          summary: "Summary 1", // Added required field
          author: testUser._id,
          tags: ["legal", "rights"],
          status: "published",
        },
        {
          title: "Blog Post 2",
          content: "Content 2",
          summary: "Summary 2", // Added required field
          author: testUser._id,
          tags: ["criminal", "law"],
          status: "published",
        },
        {
          title: "Draft Blog Post",
          content: "Draft content",
          summary: "Draft summary", // Added required field
          author: testUser._id,
          tags: ["legal"],
          status: "draft",
        },
      ]);

      const response = await request(app).get("/api/blogs");

      expect(response.status).toBe(200);
      expect(response.body.data.blogs.length).toBe(2); // Only published posts
    }, 80000); // Increased timeout for this test

    it("should filter blogs by tag", async () => {
      await Blog.create([
        {
          title: "Blog Post 1",
          content: "Content 1",
          summary: "Summary 1", // Added required field
          author: testUser._id,
          tags: ["legal", "rights"],
          status: "published",
        },
        {
          title: "Blog Post 2",
          content: "Content 2",
          summary: "Summary 2", // Added required field
          author: testUser._id,
          tags: ["criminal", "law"],
          status: "published",
        },
      ]);

      const response = await request(app).get("/api/blogs").query({
        tag: "legal",
      });

      expect(response.status).toBe(200);
      expect(response.body.data.blogs.length).toBe(1);
      expect(response.body.data.blogs[0].title).toBe("Blog Post 1");
    }, 80000); // Increased timeout for this test
  });

  describe("PATCH /api/blogs/:id", () => {
    it("should update blog post", async () => {
      const blog = await Blog.create({
        title: "Original Title",
        content: "Original content",
        summary: "Original summary", // Added required field
        author: testUser._id,
        status: "published",
      });

      const response = await request(app)
        .patch(`/api/blogs/${blog._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Title",
          content: "Updated content",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.blog.title).toBe("Updated Title");
      expect(response.body.data.blog.content).toBe("Updated content");
    }, 80000); // Increased timeout for this test

    it("should only allow author to update blog post", async () => {
      // Create another user
      const otherUser = await User.create({
        name: "Other Lawyer",
        email: "other@test.com",
        password: "password123",
        passwordConfirm: "password123",
        role: "lawyer",
      });

      // Get token for the other user
      const otherLoginResponse = await request(app).post("/api/auth/login").send({
        email: "other@test.com",
        password: "password123",
      });

      const otherToken = otherLoginResponse.body.token;

      const blog = await Blog.create({
        title: "Author Blog Post",
        content: "Content by author",
        summary: "Author's summary", // Added required field
        author: testUser._id, // By the original test user
        status: "published",
      });

      const response = await request(app)
        .patch(`/api/blogs/${blog._id}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({
          title: "Attempted Update",
        });

      expect(response.status).toBe(403);
    }, 80000); // Increased timeout for this test
  });

  describe("DELETE /api/blogs/:id", () => {
    it("should delete blog post", async () => {
      const blog = await Blog.create({
        title: "To Be Deleted",
        content: "Content to delete",
        summary: "Summary to delete", // Added required field
        author: testUser._id,
        status: "published",
      });

      const response = await request(app)
        .delete(`/api/blogs/${blog._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      const deletedBlog = await Blog.findById(blog._id);
      expect(deletedBlog).toBeNull();
    }, 80000); // Increased timeout for this test
  });
});
