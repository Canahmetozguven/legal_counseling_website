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
  Stack,
  Pagination,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Badge,
  CardActionArea,
} from '@mui/material';
import {
  Search as SearchIcon,
  Share as ShareIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Timer as TimerIcon,
  Label as LabelIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

const ITEMS_PER_PAGE = 9;

const BlogCard = ({ post, onShare }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleShareClick = event => {
    event.stopPropagation(); // Prevent card click when clicking share
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    navigate(`/blog/${post._id}`);
  };

  const handleSocialShare = platform => {
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
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    onShare();
    handleClose();
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease-in-out',
        },
      }}
    >
      <CardActionArea onClick={handleCardClick}>
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
            {post.tags.map(tag => (
              <Chip key={tag} label={tag} size="small" sx={{ mb: 1 }} />
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
      </CardActionArea>
      <Divider />
      <CardActions onClick={e => e.stopPropagation()}>
        <Button size="small" startIcon={<ShareIcon />} onClick={handleShareClick}>
          Share
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={e => e.stopPropagation()}
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
          <MenuItem onClick={() => handleSocialShare('whatsapp')}>
            <WhatsAppIcon sx={{ mr: 1 }} /> WhatsApp
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
};

const TagsSidebar = ({ tags, selectedTags, onTagToggle, postCounts }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LabelIcon />
        Tags
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List dense>
        {tags.map(tag => (
          <ListItem key={tag} disablePadding>
            <ListItemButton onClick={() => onTagToggle(tag)} dense>
              <Checkbox
                edge="start"
                checked={selectedTags.includes(tag)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={tag} />
              <Badge badgeContent={postCounts[tag] || 0} color="primary" sx={{ ml: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {selectedTags.length > 0 && (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={() => selectedTags.forEach(tag => onTagToggle(tag))}
          sx={{ mt: 2 }}
        >
          Clear Filters
        </Button>
      )}
    </Paper>
  );
};

const PublicBlogView = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tagPostCounts, setTagPostCounts] = useState({});

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, []);

  useEffect(() => {
    // Calculate post counts for each tag
    const counts = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    setTagPostCounts(counts);
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/blog/published');
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get('/api/blog/tags');
      setAvailableTags(response.data.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleShare = async postId => {
    try {
      await axiosInstance.post(`/api/blog/${postId}/share`);
      setPosts(
        posts.map(post =>
          post._id === postId
            ? { ...post, analytics: { ...post.analytics, shares: post.analytics.shares + 1 } }
            : post
        )
      );
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  const handleTagToggle = tag => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
    setPage(1);
  };

  const filteredPosts = posts
    .filter(
      post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(post =>
      selectedTags.length === 0 ? true : selectedTags.every(tag => post.tags.includes(tag))
    );

  const pageCount = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const displayedPosts = filteredPosts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Blog
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search posts..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Tags Sidebar */}
        <Grid item xs={12} md={3}>
          <TagsSidebar
            tags={availableTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            postCounts={tagPostCounts}
          />
        </Grid>

        {/* Blog Posts Grid */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={4}>
            {displayedPosts.map(post => (
              <Grid item key={post._id} xs={12} sm={6} lg={4}>
                <BlogCard post={post} onShare={() => handleShare(post._id)} />
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
        </Grid>
      </Grid>

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
