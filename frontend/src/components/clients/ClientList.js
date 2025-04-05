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
  TextField,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { debounce } from 'lodash';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get('/clients', {
        // Add retry logic
        retry: 3,
        retryDelay: retryCount => {
          return retryCount * 1000; // Wait 1s, 2s, 3s between retries
        },
      });
      setClients(response.data?.data?.clients || []);
    } catch (error) {
      if (error.response?.status === 429) {
        console.error('Rate limit exceeded. Please wait before trying again.');
        // Optional: Add automatic retry after delay
        setTimeout(fetchClients, 5000);
      } else {
        console.error('Error fetching clients:', error);
      }
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchClients = debounce(fetchClients, 1000);

  useEffect(() => {
    debouncedFetchClients();
    return () => debouncedFetchClients.cancel();
  }, [debouncedFetchClients]);

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axiosInstance.delete(`/clients/${id}`);
        setClients(clients.filter(client => client._id !== id));
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const filteredClients = clients.filter(
    client =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Clients
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/clients/new')}
        >
          Add Client
        </Button>
      </Stack>

      <Box mb={4}>
        <TextField
          fullWidth
          placeholder="Search clients..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Cases</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map(client => (
                <TableRow key={client._id}>
                  <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.cases?.length || 0}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => navigate(`/dashboard/clients/${client._id}`)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(client._id)} color="error">
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

export default ClientList;
