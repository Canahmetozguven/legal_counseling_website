import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Pagination,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Share as ShareIcon,
  ThumbUp as LikeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  FilterList as FilterIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ITEMS_PER_PAGE = 9;

const BlogCard = ({ post, onLike, onShare }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    let shareUrl;

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    onShare();
    handleClose();
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {post.featuredImage && (
        <CardMedia
          component="img"
          height="200"
          image={post.featuredImage.url}
          alt={post.featuredImage.altText}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {post.summary}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {post.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Estimated reading time">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <TimerIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {post.readingTime} min read
              </Typography>
            </Stack>
          </Tooltip>
          <Typography variant="caption" color="text.secondary">
            • {new Date(post.publishedAt).toLocaleDateString()}
          </Typography>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          size="small"
          startIcon={<LikeIcon />}
          onClick={onLike}
        >
          {post.analytics.likes}
        </Button>
        <Button
          size="small"
          startIcon={<ShareIcon />}
          onClick={handleShareClick}
        >
          Share
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleSocialShare('facebook')}>
            <FacebookIcon sx={{ mr: 1 }} /> Facebook
          </MenuItem>
          <MenuItem onClick={() => handleSocialShare('twitter')}>
            <TwitterIcon sx={{ mr: 1 }} /> Twitter
          </MenuItem>
          <MenuItem onClick={() => handleSocialShare('linkedin')}>
            <LinkedInIcon sx={{ mr: 1 }} /> LinkedIn
          </MenuItem>
        </Menu>
        <Button
          size="small"
          color="primary"
          sx={{ marginLeft: 'auto' }}
          onClick={() => window.location.href = `/blog/${post._id}`}
        >
          Read More
        </Button>
      </CardActions>
    </Card>
  );
};

const PublicBlogView = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/blog/published');
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/blog/tags');
      setAvailableTags(response.data.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`/api/blog/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId
          ? { ...post, analytics: { ...post.analytics, likes: post.analytics.likes + 1 } }
          : post
      ));
      setSnackbar({
        open: true,
        message: 'Thanks for liking!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to like the post',
        severity: 'error'
      });
    }
  };

  const handleShare = async (postId) => {
    try {
      await axios.post(`/api/blog/${postId}/share`);
      setPosts(posts.map(post => 
        post._id === postId
          ? { ...post, analytics: { ...post.analytics, shares: post.analytics.shares + 1 } }
          : post
      ));
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setPage(1);
  };

  const filteredPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(post => 
      selectedTags.length === 0 ? true :
      selectedTags.every(tag => post.tags.includes(tag))
    );

  const pageCount = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const displayedPosts = filteredPosts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Blog
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {availableTags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagToggle(tag)}
                color={selectedTags.includes(tag) ? "primary" : "default"}
              />
            ))}
          </Box>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {displayedPosts.map((post) => (
          <Grid item key={post._id} xs={12} sm={6} md={4}>
            <BlogCard
              post={post}
              onLike={() => handleLike(post._id)}
              onShare={() => handleShare(post._id)}
            />
          </Grid>
        ))}
      </Grid>

      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PublicBlogView;
