import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Pagination,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ITEMS_PER_PAGE = 6;

const BlogList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/blog/tags');
      setAvailableTags(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/blog');
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/blog/${selectedPost._id}`);
      setPosts(posts.filter(post => post._id !== selectedPost._id));
      setDeleteDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openDeleteDialog = post => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = event => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleTagFilter = tag => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
    setPage(1);
  };

  const filteredPosts = posts
    .filter(
      post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(post => (statusFilter === 'all' ? true : post.status === statusFilter))
    .filter(post =>
      selectedTags.length === 0 ? true : selectedTags.every(tag => post.tags.includes(tag))
    );

  const pageCount = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const displayedPosts = filteredPosts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Blog Posts</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/blog/new')}
        >
          New Post
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={handleStatusFilterChange} label="Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {availableTags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagFilter(tag)}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {displayedPosts.map(post => (
          <Grid item xs={12} md={6} lg={4} key={post._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {post.summary}
                </Typography>
                <Box mb={2}>
                  {post.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="textSecondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                  <Chip
                    size="small"
                    label={post.status}
                    color={post.status === 'published' ? 'success' : 'default'}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => navigate(`/blog/edit/${post._id}`)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => openDeleteDialog(post)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredPosts.length === 0 && (
        <Typography sx={{ my: 2 }} align="center" color="text.secondary">
          No posts found. Click &quot;New Post&quot; to create one.
        </Typography>
      )}

      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Blog Post</DialogTitle>
        <DialogContent>
          Are you sure you want to delete &quot;{selectedPost?.title}&quot;? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogList;
