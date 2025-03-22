const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const User = require('../../models/userModel');
const Blog = require('../../models/blogModel');

let mongoServer;
let token;
let testUser;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  testUser = await User.create({
    name: 'Test Lawyer',
    email: 'lawyer@test.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'lawyer'
  });

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'lawyer@test.com',
      password: 'password123'
    });

  token = loginResponse.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Blog.deleteMany({});
});

describe('Blog Routes', () => {
  describe('POST /api/blogs', () => {
    it('should create a new blog post', async () => {
      const blogData = {
        title: 'Understanding Legal Rights',
        content: 'This is a comprehensive guide about your legal rights...',
        tags: ['legal-rights', 'law-basics'],
        status: 'published'
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogData);

      expect(response.status).toBe(201);
      expect(response.body.data.blog.title).toBe(blogData.title);
      expect(response.body.data.blog.author).toBe(testUser._id.toString());
      expect(response.body.data.blog.tags).toEqual(expect.arrayContaining(blogData.tags));
    });

    it('should not create blog post without required fields', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Missing title...'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/blogs', () => {
    it('should get all published blog posts', async () => {
      await Blog.create([
        {
          title: 'Blog Post 1',
          content: 'Content 1',
          author: testUser._id,
          status: 'published',
          tags: ['law']
        },
        {
          title: 'Blog Post 2',
          content: 'Content 2',
          author: testUser._id,
          status: 'published',
          tags: ['rights']
        }
      ]);

      const response = await request(app)
        .get('/api/blogs')
        .query({ status: 'published' });

      expect(response.status).toBe(200);
      expect(response.body.data.blogs.length).toBe(2);
    });

    it('should filter blogs by tag', async () => {
      await Blog.create([
        {
          title: 'Blog Post 1',
          content: 'Content 1',
          author: testUser._id,
          status: 'published',
          tags: ['criminal-law']
        },
        {
          title: 'Blog Post 2',
          content: 'Content 2',
          author: testUser._id,
          status: 'published',
          tags: ['civil-law']
        }
      ]);

      const response = await request(app)
        .get('/api/blogs')
        .query({ tag: 'criminal-law' });

      expect(response.status).toBe(200);
      expect(response.body.data.blogs.length).toBe(1);
      expect(response.body.data.blogs[0].tags).toContain('criminal-law');
    });
  });

  describe('PATCH /api/blogs/:id', () => {
    it('should update blog post', async () => {
      const blog = await Blog.create({
        title: 'Original Title',
        content: 'Original content',
        author: testUser._id,
        status: 'draft'
      });

      const response = await request(app)
        .patch(`/api/blogs/${blog._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          status: 'published'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.blog.title).toBe('Updated Title');
      expect(response.body.data.blog.status).toBe('published');
    });

    it('should only allow author to update blog post', async () => {
      const otherUser = await User.create({
        name: 'Other Lawyer',
        email: 'other@test.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'lawyer'
      });

      const blog = await Blog.create({
        title: 'Original Title',
        content: 'Original content',
        author: otherUser._id,
        status: 'published'
      });

      const response = await request(app)
        .patch(`/api/blogs/${blog._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    it('should delete blog post', async () => {
      const blog = await Blog.create({
        title: 'To Be Deleted',
        content: 'Content to delete',
        author: testUser._id,
        status: 'draft'
      });

      const response = await request(app)
        .delete(`/api/blogs/${blog._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);

      const deletedBlog = await Blog.findById(blog._id);
      expect(deletedBlog).toBeNull();
    });
  });
});