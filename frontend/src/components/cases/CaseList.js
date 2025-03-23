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
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const statusColors = {
  'open': 'primary',
  'in-progress': 'warning',
  'closed': 'success',
  'pending': 'info',
};

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get('/api/cases');
      setCases(response.data.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await axios.delete(`/api/cases/${id}`);
        setCases(cases.filter(case_ => case_._id !== id));
      } catch (error) {
        console.error('Error deleting case:', error);
      }
    }
  };

  const filteredCases = cases.filter(case_ =>
    case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          Cases
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/cases/new')}
        >
          Add Case
        </Button>
      </Stack>

      <Box mb={4}>
        <TextField
          fullWidth
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Case Number</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Next Hearing</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCases.map((case_) => (
              <TableRow key={case_._id}>
                <TableCell>{case_.caseNumber}</TableCell>
                <TableCell>{case_.title}</TableCell>
                <TableCell>{case_.client?.name}</TableCell>
                <TableCell>
                  <Chip
                    label={case_.status}
                    color={statusColors[case_.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {case_.nextHearing
                    ? new Date(case_.nextHearing).toLocaleDateString()
                    : 'Not scheduled'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => navigate(`/dashboard/cases/${case_._id}`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(case_._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CaseList;
