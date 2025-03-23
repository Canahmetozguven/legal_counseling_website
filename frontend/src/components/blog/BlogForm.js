import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Autocomplete,
  Chip,
  FormControlLabel,
  Switch,
  LinearProgress
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ImageUpload from './ImageUpload';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
};

const validateForm = (formData) => {
  const errors = [];
  if (!formData.title.trim()) errors.push('Title is required');
  if (!formData.summary.trim()) errors.push('Summary is required');
  if (!formData.content.trim()) errors.push('Content is required');
  if (formData.summary.length > 500) errors.push('Summary must be less than 500 characters');
  if (formData.title.length > 200) errors.push('Title must be less than 200 characters');
  return errors;
};

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    tags: [],
    status: 'draft',
    featuredImage: null,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTags = useCallback(async () => {
    try {
      const response = await axios.get('/api/blog/tags');
      setAvailableTags(response.data.data || []);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  }, []);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/blog/${id}`);
      const post = response.data.data;
      setFormData({
        title: post.title,
        content: post.content,
        summary: post.summary,
        tags: post.tags,
        status: post.status,
        featuredImage: post.featuredImage,
        seo: post.seo || {
          metaTitle: '',
          metaDescription: '',
          keywords: []
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTags();
    if (id) {
      fetchPost();
    }
  }, [id, fetchPost, fetchTags]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleTagsChange = (event, newTags) => {
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const handleStatusChange = (e) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.checked ? 'published' : 'draft'
    }));
  };

  const handleImageUpload = (imageData) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: imageData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const method = id ? 'patch' : 'post';
      const url = id ? `/api/blog/${id}` : '/api/blog';
      
      await axios[method](url, formData);

      setSuccess(true);
      setTimeout(() => {
        navigate('/blog');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save blog post');
      console.error('Error saving blog post:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <Box p={3}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Blog Post' : 'Create New Blog Post'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Blog post {id ? 'updated' : 'created'} successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              error={formData.title.length > 200}
              helperText={formData.title.length > 200 ? 'Title must be less than 200 characters' : ''}
            />

            <TextField
              fullWidth
              label="Summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              multiline
              rows={2}
              error={formData.summary.length > 500}
              helperText={`${formData.summary.length}/500 characters`}
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Featured Image
              </Typography>
              <ImageUpload
                onImageUpload={handleImageUpload}
                initialImage={formData.featuredImage}
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Content
            </Typography>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              style={{ height: '300px', marginBottom: '50px' }}
            />

            <Autocomplete
              multiple
              freeSolo
              options={availableTags}
              value={formData.tags}
              onChange={handleTagsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tags..."
                />
              )}
            />

            <Typography variant="subtitle1" gutterBottom>
              SEO Settings
            </Typography>
            <TextField
              fullWidth
              label="Meta Title"
              name="seo.metaTitle"
              value={formData.seo.metaTitle}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Meta Description"
              name="seo.metaDescription"
              value={formData.seo.metaDescription}
              onChange={handleChange}
              multiline
              rows={2}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === 'published'}
                  onChange={handleStatusChange}
                  color="primary"
                />
              }
              label={formData.status === 'published' ? 'Published' : 'Draft'}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/blog')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : formData.status === 'published' ? 'Publish' : 'Save Draft'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default BlogForm;
