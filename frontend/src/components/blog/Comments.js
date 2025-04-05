import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
} from '@mui/material';
import { Check as ApproveIcon, Delete as DeleteIcon, Flag as FlagIcon } from '@mui/icons-material';
import axios from 'axios';

const Comments = ({ postId, comments: initialComments, isAdmin }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const handleCommentChange = field => event => {
    setNewComment({
      ...newComment,
      [field]: event.target.value,
    });
  };

  const handleSubmitComment = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/blog/${postId}/comments`, newComment);

      setComments([...comments, response.data.data]);
      setNewComment({ name: '', email: '', content: '' });
      setSuccess('Comment submitted successfully! Waiting for approval.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit comment');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleApproveComment = async commentId => {
    try {
      await axios.patch(`/api/blog/${postId}/comments/${commentId}/approve`);
      setComments(
        comments.map(comment =>
          comment._id === commentId ? { ...comment, isApproved: true } : comment
        )
      );
    } catch (err) {
      setError('Failed to approve comment');
      setTimeout(() => setError(''), 5000);
    }
  };

  const openDeleteDialog = comment => {
    setSelectedComment(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/api/blog/${postId}/comments/${selectedComment._id}`);
      setComments(comments.filter(c => c._id !== selectedComment._id));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Failed to delete comment');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.filter(c => c.isApproved).length})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <List>
        {comments
          .filter(comment => isAdmin || comment.isApproved)
          .map((comment, index) => (
            <React.Fragment key={comment._id}>
              {index > 0 && <Divider />}
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  isAdmin && (
                    <Stack direction="row" spacing={1}>
                      {!comment.isApproved && (
                        <IconButton
                          edge="end"
                          onClick={() => handleApproveComment(comment._id)}
                          color="success"
                        >
                          <ApproveIcon />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        onClick={() => openDeleteDialog(comment)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  )
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2">{comment.author.name}</Typography>
                      {!comment.isApproved && <Chip size="small" label="Pending" color="warning" />}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', my: 1 }}
                      >
                        {comment.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
      </List>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add a Comment
        </Typography>
        <form onSubmit={handleSubmitComment}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={newComment.name}
              onChange={handleCommentChange('name')}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newComment.email}
              onChange={handleCommentChange('email')}
              required
              fullWidth
            />
            <TextField
              label="Comment"
              multiline
              rows={4}
              value={newComment.content}
              onChange={handleCommentChange('content')}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Submit Comment
            </Button>
          </Stack>
        </form>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>Are you sure you want to delete this comment?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteComment} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Comments;
