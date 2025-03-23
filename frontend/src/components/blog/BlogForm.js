import React, { useState, useEffect } from 'react';
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
  Switch
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

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

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    tags: [],
    status: 'draft'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTags();
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/blog/tags');
      setAvailableTags(response.data.data || []);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/blog/${id}`);
      const post = response.data.data;
      setFormData({
        title: post.title,
        content: post.content,
        summary: post.summary,
        tags: post.tags,
        status: post.status
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content
    });
  };

  const handleTagsChange = (event, newTags) => {
    setFormData({
      ...formData,
      tags: newTags
    });
  };

  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      status: e.target.checked ? 'published' : 'draft'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'patch' : 'post';
      const url = id ? `/api/blog/${id}` : '/api/blog';
      
      await axios[method](url, formData);

      setSuccess(true);
      setTimeout(() => {
        navigate('/blog');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id, fetchPost]);

  if (loading) {
    return (
      <Box p={3}>
        <Typography>Loading...</Typography>
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
            />

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

            <Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                {formData.status === 'published' ? 'Publish' : 'Save Draft'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/blog')}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default BlogForm;
