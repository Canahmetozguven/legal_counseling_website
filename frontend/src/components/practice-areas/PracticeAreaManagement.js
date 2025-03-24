import React, { useState, useEffect } from 'react';
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
} from '@mui/icons-material';
import {
  getAllPracticeAreas,
  createPracticeArea,
  updatePracticeArea,
  deletePracticeArea,
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this practice area?')) {
      try {
        await deletePracticeArea(id);
        fetchPracticeAreas();
      } catch (error) {
        console.error('Error deleting practice area:', error);
      }
    }
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
            {practiceAreas.map((area) => (
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
        <DialogTitle>
          {currentArea ? 'Edit Practice Area' : 'Add New Practice Area'}
        </DialogTitle>
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
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