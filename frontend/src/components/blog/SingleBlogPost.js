import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Stack,
  Button,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Share as ShareIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  WhatsApp as WhatsAppIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import SEO from '../../utils/seo/SEO';
import { getBlogPostSchema } from '../../utils/seo/SchemaTemplates';

const SingleBlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fetchPost = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/blog/${id}`);
      setPost(response.data.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleShareClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = async platform => {
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
    handleClose();

    try {
      await axiosInstance.post(`/api/blog/${id}/share`);
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return <Typography variant="h6">Post not found</Typography>;
  }

  // Generate structured data for this article
  const articleSchema = getBlogPostSchema({
    headline: post.title,
    description: post.summary,
    image: post.featuredImage?.url || `${window.location.origin}/logo512.png`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    authorName: post.author?.name || 'Musti Attorneys',
    url: window.location.href,
  });

  const keywords = [...post.tags, 'legal advice', 'law firm blog', 'legal insights'];

  return (
    <>
      <SEO
        title={`${post.title} | Musti Attorneys Blog`}
        description={post.summary}
        type="article"
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        author={post.author?.name}
        image={post.featuredImage?.url}
        keywords={keywords}
        schema={articleSchema}
      />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {post.featuredImage && (
          <Box
            component="img"
            src={post.featuredImage.url}
            alt={post.featuredImage.altText}
            sx={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: 2,
              mb: 4,
            }}
          />
        )}

        <Paper sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            {post.title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TimerIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {post.readingTime} min read
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              • {new Date(post.publishedAt).toLocaleDateString()}
            </Typography>
            <Button startIcon={<ShareIcon />} onClick={handleShareClick} size="small">
              Share
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 4 }}>
            {post.tags.map(tag => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>

          <Typography variant="subtitle1" color="text.secondary" paragraph>
            {post.summary}
          </Typography>

          <Divider sx={{ my: 4 }} />

          <div dangerouslySetInnerHTML={{ __html: post.content }} />

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => handleShare('facebook')}>
              <FacebookIcon sx={{ mr: 1 }} /> Facebook
            </MenuItem>
            <MenuItem onClick={() => handleShare('twitter')}>
              <TwitterIcon sx={{ mr: 1 }} /> Twitter
            </MenuItem>
            <MenuItem onClick={() => handleShare('linkedin')}>
              <LinkedInIcon sx={{ mr: 1 }} /> LinkedIn
            </MenuItem>
            <MenuItem onClick={() => handleShare('whatsapp')}>
              <WhatsAppIcon sx={{ mr: 1 }} /> WhatsApp
            </MenuItem>
          </Menu>
        </Paper>
      </Container>
    </>
  );
};

export default SingleBlogPost;
