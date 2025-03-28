import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import {
  People as PeopleIcon,
  Gavel as GavelIcon,
  Event as EventIcon,
  Article as ArticleIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { ResponsivePie } from '@nivo/pie';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalCases: 0,
    totalAppointments: 0,
    totalBlogs: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [caseData, setCaseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, appointmentsRes] = await Promise.all([
          axios.get('/api/dashboard/stats'),
          axios.get('/api/appointments/recent')
        ]);
        
        setStats(statsRes.data?.data || statsRes.data || {});
        setRecentAppointments(appointmentsRes.data?.data?.appointments || []);
        
        // Mock case status data (replace with actual API call)
        setCaseData([
          { id: 'Active', value: 35, color: '#2196f3' },
          { id: 'Closed', value: 25, color: '#4caf50' },
          { id: 'Pending', value: 20, color: '#ff9800' },
          { id: 'On Hold', value: 15, color: '#f44336' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 40, color: 'primary.dark' }} />
        </Box>
      </CardContent>
    </Card>
  );

  const QuickActions = () => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Stack spacing={2}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          fullWidth
          onClick={() => navigate('/dashboard/cases/new')}
          sx={{ backgroundColor: 'primary.dark' }}
        >
          New Case
        </Button>
        <Button 
          variant="contained" 
          startIcon={<EventIcon />} 
          fullWidth
          onClick={() => navigate('/dashboard/appointments/new')}
          sx={{ backgroundColor: 'primary.dark' }}
        >
          Schedule Appointment
        </Button>
        <Button 
          variant="contained" 
          startIcon={<PeopleIcon />} 
          fullWidth
          onClick={() => navigate('/dashboard/clients/new')}
          sx={{ backgroundColor: 'primary.dark' }}
        >
          Add Client
        </Button>
        <Button 
          variant="contained" 
          startIcon={<ArticleIcon />} 
          fullWidth
          onClick={() => navigate('/dashboard/blog/new')}
          sx={{ backgroundColor: 'primary.dark' }}
        >
          Create Blog Post
        </Button>
      </Stack>
    </Paper>
  );

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={PeopleIcon}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Cases"
            value={stats.totalCases}
            icon={GavelIcon}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Appointments"
            value={stats.totalAppointments}
            icon={EventIcon}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Blog Posts"
            value={stats.totalBlogs}
            icon={ArticleIcon}
            color="#9c27b0"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Case Status Distribution
            </Typography>
            <Box height={300}>
              <ResponsivePie
                data={caseData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ datum: 'data.color' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                enableArcLabels={true}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="white"
                legends={[
                  {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                  }
                ]}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Calendar
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar />
            </LocalizationProvider>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <QuickActions />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Appointments
            </Typography>
            <List>
              {recentAppointments.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No upcoming appointments" />
                </ListItem>
              ) : (
                recentAppointments.map((appointment) => (
                  <React.Fragment key={appointment._id}>
                    <ListItem>
                      <ListItemText
                        primary={`${appointment.client?.firstName} ${appointment.client?.lastName}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {appointment.title}
                            </Typography>
                            <br />
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                            {` ${appointment.startTime} - ${appointment.endTime}`}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" size="small">
                          <ArrowForwardIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
