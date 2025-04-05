import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import {
  getAllPracticeAreas,
  createPracticeArea,
  updatePracticeArea,
  deletePracticeArea,
  uploadPracticeAreaImage,
} from '../../api/practiceAreaService';

const PracticeAreaManagement = () => {
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentArea, setCurrentArea] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    content: '',
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);

  // Helper function to get the correct image URL with fallback
  const getImageUrl = imagePath => {
    // If no image path provided, return a data URI for a gray placeholder
    if (!imagePath) {
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDAwIDIwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UsIHNhbnMtc2VyaWYiIGZpbGw9IiM1NTU1NTUiPkxlZ2FsIFNlcnZpY2VzPC90ZXh0Pjwvc3ZnPg==';
    }

    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // For development environment, use the backend directly
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? `${window.location.protocol}//${window.location.hostname}`
        : 'http://localhost:5000';

    // For image filenames, make sure they point to backend uploads
    // Strip any leading slashes to avoid double slashes
    const cleanPath = imagePath.replace(/^\/+/, '');

    // Return complete URL - ensure no /api/ prefix
    return `${baseUrl}/uploads/${cleanPath}`;
  };

  const fetchPracticeAreas = async () => {
    try {
      const response = await getAllPracticeAreas();
      setPracticeAreas(response.data.data.practiceAreas);
    } catch (error) {
      console.error('Error fetching practice areas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPracticeAreas();
  }, []);

  const handleOpen = (area = null) => {
    if (area) {
      setCurrentArea(area);
      setFormData(area);
    } else {
      setCurrentArea(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        content: '',
        order: practiceAreas.length,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentArea(null);
  };

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = e => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // First, upload image if one is selected
    if (imageFile) {
      await handleImageUpload();
    }

    try {
      if (currentArea) {
        await updatePracticeArea(currentArea._id, formData);
      } else {
        await createPracticeArea(formData);
      }
      handleClose();
      fetchPracticeAreas();
    } catch (error) {
      console.error('Error saving practice area:', error);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this practice area?')) {
      try {
        await deletePracticeArea(id);
        fetchPracticeAreas();
      } catch (error) {
        console.error('Error deleting practice area:', error);
      }
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const imageFormData = new FormData();
    imageFormData.append('image', imageFile);

    try {
      setLoading(true);
      const response = await uploadPracticeAreaImage(
        currentArea ? currentArea._id : null,
        imageFormData
      );

      console.log('Upload response:', response); // Debug logging

      // Update form data with the image path - fix to correctly access the data
      if (response && response.data && response.data.data && response.data.data.imagePath) {
        setFormData(prev => ({
          ...prev,
          image: response.data.data.imagePath,
        }));

        console.log('Image path updated to:', response.data.data.imagePath);
      } else {
        console.error('Invalid response structure:', response);
      }

      setImageFile(null);
      if (imageInputRef.current) imageInputRef.current.value = null;
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create an onError handler for images
  const handleImageError = e => {
    console.error('Image failed to load:', e.target.src);
    // Use a data URI that complies with CSP rather than an external URL
    e.target.src =
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDAwIDIwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UsIHNhbnMtc2VyaWYiIGZpbGw9IiNkZDAwMDAiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Practice Areas Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Practice Area
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {practiceAreas.map(area => (
              <TableRow key={area._id}>
                <TableCell>{area.order}</TableCell>
                <TableCell>{area.title}</TableCell>
                <TableCell>{area.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(area)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(area._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{currentArea ? 'Edit Practice Area' : 'Add New Practice Area'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />

            {/* Image Preview */}
            {formData.image && (
              <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <img
                  src={getImageUrl(formData.image)}
                  alt={formData.title}
                  style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                  onError={handleImageError}
                />
              </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button variant="outlined" component="label" startIcon={<ImageIcon />}>
                Select Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={imageInputRef}
                />
              </Button>
              {imageFile && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleImageUpload}
                  disabled={loading}
                >
                  Upload Image
                </Button>
              )}
              <Typography variant="body2" color="textSecondary">
                {imageFile ? `Selected: ${imageFile.name}` : 'No file selected'}
              </Typography>
            </Box>

            <TextField
              margin="normal"
              fullWidth
              label="Or enter image URL"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              helperText="You can either upload a new image or enter a URL"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Content"
              name="content"
              multiline
              rows={10}
              value={formData.content}
              onChange={handleInputChange}
              helperText="HTML content is supported"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PracticeAreaManagement;
