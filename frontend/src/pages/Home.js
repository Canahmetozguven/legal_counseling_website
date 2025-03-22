import React from 'react';
import { Container, Typography, Grid, Paper, Box, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import BusinessIcon from '@mui/icons-material/Business';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Home = () => {
  const navigate = useNavigate();

  const practicedAreas = [
    { 
      title: 'Corporate Law', 
      description: 'Expert guidance in business formations, contracts, mergers & acquisitions, and corporate governance.',
      icon: <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    { 
      title: 'Civil Litigation', 
      description: 'Strong advocacy in civil disputes, personal injury cases, and complex commercial litigation.',
      icon: <GavelIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    { 
      title: 'Family Law', 
      description: 'Compassionate representation in divorce, custody, and other family-related legal matters.',
      icon: <FamilyRestroomIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    { 
      title: 'Real Estate', 
      description: 'Comprehensive legal services for property transactions, leases, and real estate litigation.',
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(rgba(26, 35, 126, 0.9), rgba(26, 35, 126, 0.9)), url("/images/law-office.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 10, md: 15 },
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 'md', mx: 'auto', textAlign: 'center' }}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                fontWeight: 700,
                mb: 3
              }}
            >
              Expert Legal Solutions
            </Typography>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ mb: 4, fontWeight: 300 }}
            >
              Dedicated to protecting your rights and interests with over 20 years of legal excellence
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{ 
                py: 2,
                px: 4,
                fontSize: '1.1rem'
              }}
            >
              Free Consultation
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Practice Areas Section */}
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h2" 
          gutterBottom 
          textAlign="center"
          sx={{ mb: 6 }}
        >
          Our Practice Areas
        </Typography>
        <Grid container spacing={4}>
          {practicedAreas.map((area, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    {area.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom component="h3">
                    {area.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {area.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Why Choose Us Section */}
        <Box sx={{ mt: 12, mb: 8 }}>
          <Typography variant="h2" component="h2" gutterBottom textAlign="center" sx={{ mb: 6 }}>
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, height: '100%', backgroundColor: 'primary.main', color: 'white' }}>
                <Typography variant="h5" gutterBottom>
                  Experienced Team
                </Typography>
                <Typography>
                  Our attorneys bring decades of combined experience and a track record of success in various areas of law.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, height: '100%', backgroundColor: 'secondary.main' }}>
                <Typography variant="h5" gutterBottom>
                  Client-Focused Approach
                </Typography>
                <Typography>
                  We prioritize understanding your unique needs and provide personalized legal solutions tailored to your situation.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, height: '100%', backgroundColor: 'primary.main', color: 'white' }}>
                <Typography variant="h5" gutterBottom>
                  Proven Track Record
                </Typography>
                <Typography>
                  Our firm has successfully handled numerous complex cases and achieved favorable outcomes for our clients.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action Section */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 2,
            backgroundColor: 'secondary.light',
            borderRadius: 2,
            mt: 8
          }}
        >
          <Typography variant="h3" gutterBottom>
            Ready to Discuss Your Case?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: 'md', mx: 'auto' }}>
            Contact us today for a free consultation with our experienced legal team.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/contact')}
          >
            Schedule Consultation
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Home;