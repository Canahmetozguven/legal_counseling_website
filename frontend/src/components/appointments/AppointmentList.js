import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const statusColors = {
  'scheduled': 'primary',
  'confirmed': 'info',
  'completed': 'success',
  'canceled': 'error',
  'rescheduled': 'warning',
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data?.data?.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`/api/appointments/${id}`);
        setAppointments(appointments.filter(appointment => appointment._id !== id));
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatEndTime = (date, duration) => {
    const endDate = new Date(date);
    endDate.setMinutes(endDate.getMinutes() + duration);
    return endDate.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getEndTime = (appointment) => {
    if (appointment.endTime) {
      return appointment.endTime;
    }
    if (appointment.date && appointment.duration) {
      return formatEndTime(appointment.date, appointment.duration);
    }
    return 'N/A';
  };

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/appointments/new')}
        >
          Add Appointment
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Lawyer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time (Start - End)</TableCell>  {/* Updated header */}
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.title || 'No Title'}</TableCell>
                  <TableCell>
                    {appointment.client ? 
                      `${appointment.client.firstName} ${appointment.client.lastName}` 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {appointment.lawyer ? 
                      (appointment.lawyer.firstName && appointment.lawyer.lastName ? 
                        `${appointment.lawyer.firstName} ${appointment.lawyer.lastName}` :
                        appointment.lawyer.name || appointment.lawyer.email || 'Unknown') 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {appointment.formattedDate || 
                     (appointment.date ? new Date(appointment.date).toLocaleDateString('tr-TR') : 'N/A')}
                  </TableCell>
                  <TableCell>
                    {appointment.startTime && appointment.endTime ? 
                      `${appointment.startTime} - ${appointment.endTime}` :
                      appointment.formattedTime ? 
                        `${appointment.formattedTime} - ${getEndTime(appointment)}` :
                        appointment.date ? 
                          `${formatTime(appointment.date)} - ${formatEndTime(appointment.date, appointment.duration || 60)}` : 
                          'N/A'
                    }
                  </TableCell>
                  <TableCell>{appointment.type || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      color={statusColors[appointment.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => navigate(`/dashboard/appointments/${appointment._id}`)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(appointment._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AppointmentList;
