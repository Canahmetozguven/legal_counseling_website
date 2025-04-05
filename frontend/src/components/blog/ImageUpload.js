import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axiosInstance from '../../api/axiosConfig';

const ImageUpload = ({ onImageUpload, initialImage = null }) => {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(initialImage);
  const [caption, setCaption] = useState(initialImage?.caption || '');
  const [altText, setAltText] = useState(initialImage?.altText || '');
  const [error, setError] = useState('');

  const handleFileSelect = async event => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post('/api/blog/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedImage = {
        url: response.data.data.url,
        caption,
        altText,
      };

      setImage(uploadedImage);
      onImageUpload(uploadedImage);
    } catch (err) {
      setError('Failed to upload image: ' + (err.response?.data?.message || 'Please try again.'));
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setCaption('');
    setAltText('');
    onImageUpload(null);
  };

  const handleMetadataChange = (field, value) => {
    if (field === 'caption') {
      setCaption(value);
    } else {
      setAltText(value);
    }

    if (image) {
      const updatedImage = {
        ...image,
        [field]: value,
      };
      setImage(updatedImage);
      onImageUpload(updatedImage);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Featured Image
      </Typography>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {uploading && <LinearProgress sx={{ mb: 2 }} />}

      {image ? (
        <Box>
          <Box
            sx={{
              position: 'relative',
              mb: 2,
              '&:hover .delete-button': {
                opacity: 1,
              },
            }}
          >
            <img
              src={image.url}
              alt={altText}
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
            <IconButton
              className="delete-button"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'background.paper',
                opacity: 0,
                transition: 'opacity 0.2s',
                '&:hover': {
                  bgcolor: 'background.paper',
                },
              }}
              onClick={handleRemoveImage}
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Image Caption"
            value={caption}
            onChange={e => handleMetadataChange('caption', e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Alt Text"
            value={altText}
            onChange={e => handleMetadataChange('altText', e.target.value)}
            helperText="Describe the image for accessibility"
          />
        </Box>
      ) : (
        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadIcon />}
          sx={{ width: '100%', height: '100px' }}
          disabled={uploading}
        >
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
        </Button>
      )}
    </Paper>
  );
};

export default ImageUpload;
