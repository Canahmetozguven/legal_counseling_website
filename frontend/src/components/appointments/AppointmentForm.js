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
import axiosInstance from '../../api/axiosConfig';

const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    client: null,
    lawyer: null,
    dateTime: null,
    duration: 60,
    type: 'consultation',
    status: 'scheduled',
    location: '',
    notes: '',
  });

  // Load clients and lawyers first
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Fetch clients and lawyers in parallel
        const [clientsResponse, lawyersResponse] = await Promise.all([
          axiosInstance.get('/api/clients'),
          axiosInstance.get('/api/users/lawyers'),
        ]);

        // Extract clients data
        const clientsData = clientsResponse.data.data?.clients || [];
        setClients(clientsData);

        // Extract lawyers data - handle different response structures
        let lawyerUsers = [];
        const lawyersData = lawyersResponse.data;

        if (lawyersData.data?.lawyers) {
          lawyerUsers = lawyersData.data.lawyers;
        } else if (lawyersData.lawyers) {
          lawyerUsers = lawyersData.lawyers;
        } else if (Array.isArray(lawyersData.data)) {
          lawyerUsers = lawyersData.data;
        } else if (Array.isArray(lawyersData)) {
          lawyerUsers = lawyersData;
        }

        setLawyers(lawyerUsers);

        // If we're editing, fetch the appointment data after clients and lawyers are loaded
        if (id) {
          await fetchAppointment(id, clientsData, lawyerUsers);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Failed to load required data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id]); // Only depend on id

  const fetchAppointment = async (appointmentId, clientsList, lawyersList) => {
    try {
      const response = await axiosInstance.get(`/api/appointments/${appointmentId}`);
      console.log('Appointment API response:', response.data);

      // Correctly extract the appointment data from the response
      // The API returns { status: 'success', data: { appointment: {...} } }
      const appointmentData =
        response.data.data?.appointment || response.data.appointment || response.data;

      if (!appointmentData) {
        throw new Error('No appointment data found');
      }

      console.log('Extracted appointment data:', appointmentData);

      // Find matching client
      let clientMatch = null;
      if (appointmentData.client) {
        const clientId =
          typeof appointmentData.client === 'object'
            ? appointmentData.client._id
            : appointmentData.client;

        clientMatch = clientsList.find(c => c._id === clientId);
        console.log('Matched client:', clientMatch);
      }

      // Find matching lawyer
      let lawyerMatch = null;
      if (appointmentData.lawyer) {
        const lawyerId =
          typeof appointmentData.lawyer === 'object'
            ? appointmentData.lawyer._id
            : appointmentData.lawyer;

        lawyerMatch = lawyersList.find(l => l._id === lawyerId);
        console.log('Matched lawyer:', lawyerMatch);
      }

      // Parse date
      let dateTime = null;
      if (appointmentData.date) {
        dateTime = new Date(appointmentData.date);
      } else if (appointmentData.dateTime) {
        dateTime = new Date(appointmentData.dateTime);
      }

      console.log('Setting form data with parsed values:', {
        title: appointmentData.title,
        client: clientMatch,
        lawyer: lawyerMatch,
        dateTime: dateTime,
      });

      // Set form data
      setFormData({
        title: appointmentData.title || '',
        client: clientMatch,
        lawyer: lawyerMatch,
        dateTime: dateTime,
        duration: appointmentData.duration || 60,
        type: appointmentData.type || 'consultation',
        status: appointmentData.status || 'scheduled',
        location: appointmentData.location || '',
        notes: appointmentData.notes || '',
      });
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Error loading appointment: ' + (error.message || 'Unknown error'));
    }
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Check if client is selected
      if (!formData.client || !formData.client._id) {
        setError('Please select a client');
        setLoading(false);
        return;
      }

      // Check if lawyer is selected
      if (!formData.lawyer || !formData.lawyer._id) {
        setError('Please select a lawyer');
        setLoading(false);
        return;
      }

      // Check if dateTime is valid
      if (!formData.dateTime || isNaN(new Date(formData.dateTime).getTime())) {
        setError('Please enter a valid date and time');
        setLoading(false);
        return;
      }

      const startDate = new Date(formData.dateTime);
      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + Number(formData.duration));

      // Format dates
      const formattedDate = startDate.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Europe/Istanbul',
      });

      const formattedStartTime = startDate.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Istanbul',
      });

      const formattedEndTime = endDate.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Istanbul',
      });

      // Create data to submit - IMPORTANT CHANGE: Keep the client ID!
      const submitData = {
        title: formData.title,
        client: formData.client?._id,
        lawyer: formData.lawyer?._id,
        date: startDate.toISOString(),
        dateTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        duration: formData.duration,
        type: formData.type,
        status: formData.status,
        location: formData.location,
        notes: formData.notes,
        formattedDate,
        formattedTime: formattedStartTime,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };

      // Log any potential issues
      if (!formData.client?._id) console.error('No client ID found in form data');
      if (!formData.lawyer?._id) console.error('No lawyer ID found in form data');

      console.log('Submitting appointment data:', submitData);

      // Send to backend
      if (id) {
        await axiosInstance.patch(`/api/appointments/${id}`, submitData);
      } else {
        await axiosInstance.post('/api/appointments', submitData);
      }

      navigate('/dashboard/appointments');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving appointment');
      console.error('Error details:', error.response?.data || error);
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
                getOptionLabel={option => {
                  console.log('Option in getOptionLabel:', option);
                  return option && typeof option === 'object'
                    ? `${option.firstName || ''} ${option.lastName || ''}`.trim()
                    : '';
                }}
                isOptionEqualToValue={(option, value) => {
                  return option && value ? option._id === value._id : option === value;
                }}
                value={formData.client}
                onChange={(event, newValue) => {
                  console.log('Selected client:', newValue);
                  setFormData({ ...formData, client: newValue });
                }}
                renderInput={params => <TextField {...params} label="Client" required />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Appointment Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={lawyers}
                getOptionLabel={option => {
                  console.log('getOptionLabel called with:', option);
                  return option && typeof option === 'object'
                    ? `${option.firstName || ''} ${option.lastName || ''}`.trim() ||
                        option.name ||
                        option.email ||
                        ''
                    : '';
                }}
                isOptionEqualToValue={(option, value) => {
                  console.log('isOptionEqualToValue comparing:', option, value);
                  return option && value ? option._id === value._id : option === value;
                }}
                value={formData.lawyer}
                onChange={(event, newValue) => {
                  console.log('Selected lawyer:', newValue);
                  setFormData({ ...formData, lawyer: newValue });
                }}
                renderInput={params => {
                  console.log('renderInput params:', params);
                  return <TextField {...params} label="Lawyer" required />;
                }}
                renderOption={(props, option) => {
                  console.log('renderOption called with:', option);
                  return (
                    <li {...props}>
                      {option.firstName && option.lastName
                        ? `${option.firstName} ${option.lastName}`
                        : option.name || option.email || 'Unknown Lawyer'}
                    </li>
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Date & Time"
                value={formData.dateTime}
                onChange={newValue => {
                  setFormData({ ...formData, dateTime: newValue });
                }}
                inputFormat="dd.MM.yyyy HH:mm" // Turkish date format with 24h time
                ampm={false} // Use 24-hour format
                renderInput={params => <TextField {...params} fullWidth required />}
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
                <Select name="type" value={formData.type} onChange={handleChange} label="Type">
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="court">Court preparation</MenuItem>
                  <MenuItem value="deposition">Deposition</MenuItem>
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
                  <MenuItem value="canceled">Cancelled</MenuItem>
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
                <Button variant="outlined" onClick={() => navigate('/dashboard/appointments')}>
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

export default AppointmentForm;
