import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

const CaseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    caseNumber: '',
    client: null,
    status: 'open',
    caseType: '', // Add the missing caseType field
    description: '',
    nextHearing: null,
    courtDetails: '',
    notes: { content: '' }, // Change notes to be an object with content
  });

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get('/api/clients');
      console.log('API response:', response.data);

      // Handle the correct nested structure
      let clientsData = [];
      if (response.data && response.data.data && response.data.data.clients) {
        // Access the clients array from the nested structure
        clientsData = Array.isArray(response.data.data.clients) ? response.data.data.clients : [];
      } else if (response.data && response.data.data) {
        clientsData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        clientsData = response.data;
      }

      console.log('Processed clients data:', clientsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]); // Set to empty array on error
    }
  };

  const fetchCase = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/cases/${id}`);
      const caseData = response.data.data;
      setFormData({
        ...caseData,
        client: clients.find(c => c._id === caseData.client?._id) || null,
        nextHearing: caseData.nextHearing ? new Date(caseData.nextHearing) : null,
      });
    } catch (error) {
      setError('Error fetching case details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [id, clients]);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    console.log('Available clients:', clients);
  }, [clients]);

  useEffect(() => {
    if (id) {
      fetchCase();
    }
  }, [id, fetchCase]);

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'notes') {
      setFormData({
        ...formData,
        notes: { content: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const submitData = {
        ...formData,
        client: formData.client?._id,
      };

      if (id) {
        await axiosInstance.patch(`/api/cases/${id}`, submitData);
      } else {
        await axiosInstance.post('/api/cases', submitData);
      }

      navigate('/dashboard/cases');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving case');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Edit Case' : 'New Case'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Case Number"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={Array.isArray(clients) ? clients : []}
                getOptionLabel={option => {
                  if (!option) return '';
                  return (
                    option.fullName ||
                    `${option.firstName || ''} ${option.lastName || ''}`.trim() ||
                    String(option._id) ||
                    ''
                  );
                }}
                value={formData.client}
                onChange={(event, newValue) => {
                  console.log('Selected client:', newValue);
                  setFormData({ ...formData, client: newValue });
                }}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false;
                  return option._id === value._id;
                }}
                renderInput={params => <TextField {...params} label="Client" required />}
                noOptionsText="No clients found"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Next Hearing Date"
                value={formData.nextHearing}
                onChange={newValue => {
                  setFormData({ ...formData, nextHearing: newValue });
                }}
                renderInput={params => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Court Details"
                name="courtDetails"
                value={formData.courtDetails}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Case Type</InputLabel>
                <Select
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleChange}
                  label="Case Type"
                >
                  <MenuItem value="civil">Civil</MenuItem>
                  <MenuItem value="criminal">Criminal</MenuItem>
                  <MenuItem value="family">Family</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={4}
                value={formData.notes.content || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate('/dashboard/cases')}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CaseForm;
