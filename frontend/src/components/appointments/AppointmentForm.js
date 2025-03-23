import React, { useState, useEffect } from 'react';
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
import { DateTimePicker } from '@mui/x-date-pickers';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client: null,
    dateTime: null,
    duration: 60,
    type: 'consultation',
    status: 'scheduled',
    notes: '',
    location: '',
  });

  useEffect(() => {
    fetchClients();
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients');
      setClients(response.data.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/appointments/${id}`);
      const appointmentData = response.data.data;
      setFormData({
        ...appointmentData,
        client: clients.find(c => c._id === appointmentData.client?._id) || null,
        dateTime: appointmentData.dateTime ? new Date(appointmentData.dateTime) : null,
      });
    } catch (error) {
      setError('Error fetching appointment details');
      console.error('Error:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const submitData = {
        ...formData,
        client: formData.client?._id,
      };

      if (id) {
        await axios.patch(`/api/appointments/${id}`, submitData);
      } else {
        await axios.post('/api/appointments', submitData);
      }

      navigate('/dashboard/appointments');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving appointment');
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
          {id ? 'Edit Appointment' : 'New Appointment'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.name}
                value={formData.client}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, client: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Date & Time"
                value={formData.dateTime}
                onChange={(newValue) => {
                  setFormData({ ...formData, dateTime: newValue });
                }}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                inputProps={{ min: 15, step: 15 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                >
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="follow-up">Follow-up</MenuItem>
                  <MenuItem value="court-preparation">Court Preparation</MenuItem>
                  <MenuItem value="document-review">Document Review</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
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
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="rescheduled">Rescheduled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard/appointments')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
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

export default AppointmentForm;
