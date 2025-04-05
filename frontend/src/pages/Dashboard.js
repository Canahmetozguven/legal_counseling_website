import React from 'react';
import { Grid, Card, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Grid container spacing={3} style={{ padding: '20px' }}>
      {/* User Statistics */}
      <Grid item xs={12} md={6} lg={4}>
        <Card style={{ padding: '20px' }}>
          <Typography variant="h5">Total Users</Typography>
          <Typography variant="h2">123</Typography>
        </Card>
      </Grid>

      {/* Recent Activities */}
      <Grid item xs={12} md={6} lg={4}>
        <Card style={{ padding: '20px' }}>
          <Typography variant="h5">Recent Activities</Typography>
          <ul>
            <li>User A logged in</li>
            <li>Client B added</li>
            <li>Contact form submitted</li>
          </ul>
        </Card>
      </Grid>

      {/* Navigation Links */}
      <Grid item xs={12} md={6} lg={4}>
        <Card style={{ padding: '20px' }}>
          <Typography variant="h5">Navigation</Typography>
          <ul>
            <li>
              <a href="/clients">Clients</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/">Home</a>
            </li>
          </ul>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
