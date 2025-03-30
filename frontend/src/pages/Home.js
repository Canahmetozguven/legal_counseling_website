import React from 'react';
import { Container, Typography, Grid, Paper, Box, Button, Card, CardContent, Divider, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import BusinessIcon from '@mui/icons-material/Business';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PersonIcon from '@mui/icons-material/Person';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const practicedAreas = [
    { 
      title: 'Corporate Law', 
      description: 'Expert guidance in business formations, contracts, mergers & acquisitions, and corporate governance.',
      icon: <BusinessIcon sx={{ fontSize: 50, color: 'primary.main' }} />
    },
    { 
      title: 'Civil Litigation', 
      description: 'Strong advocacy in civil disputes, personal injury cases, and complex commercial litigation.',
      icon: <GavelIcon sx={{ fontSize: 50, color: 'primary.main' }} />
    },
    { 
      title: 'Family Law', 
      description: 'Compassionate representation in divorce, custody, and other family-related legal matters.',
      icon: <FamilyRestroomIcon sx={{ fontSize: 50, color: 'primary.main' }} />
    },
    { 
      title: 'Real Estate', 
      description: 'Comprehensive legal services for property transactions, leases, and real estate litigation.',
      icon: <AccountBalanceIcon sx={{ fontSize: 50, color: 'primary.main' }} />
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(rgba(0, 40, 85, 0.9), rgba(0, 40, 85, 0.85)), url("/images/law-office.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 12, md: 18 },
          mb: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 'md', mx: 'auto', textAlign: 'center' }}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontFamily: '"Merriweather", serif',
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                fontWeight: 700,
                mb: 4
              }}
            >
              Expert Legal Counseling
            </Typography>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ mb: 6, fontWeight: 400, fontSize: { xs: '1.2rem', md: '1.4rem' }, lineHeight: 1.6, maxWidth: '80%', mx: 'auto' }}
            >
              Dedicated to protecting your rights and interests with over 20 years of legal excellence and personalized guidance
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/contact')}
                sx={{ 
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  }
                }}
              >
                Free Consultation
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/practice-areas')}
                sx={{ 
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#f0f0f0',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Our Services
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Legal Expertise Banner */}
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            mb: 10,
            py: 3,
            px: 4,
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <GavelIcon sx={{ fontSize: 30, mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Expert Legal Advice
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 2, display: { xs: 'none', md: 'block' } }} />
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <PersonIcon sx={{ fontSize: 30, mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Client-Focused Approach
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 2, display: { xs: 'none', md: 'block' } }} />
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <ScheduleIcon sx={{ fontSize: 30, mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              24/7 Legal Support
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Practice Areas Section */}
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h2" 
          gutterBottom 
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Our Practice Areas
        </Typography>
        <Typography 
          variant="subtitle1" 
          textAlign="center" 
          color="text.secondary"
          sx={{ mb: 8, maxWidth: '700px', mx: 'auto', fontSize: '1.1rem' }}
        >
          Our attorneys specialize in diverse legal fields to provide comprehensive counseling for all your legal needs
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
                    boxShadow: '0 8px 24px rgba(0,40,85,0.12)',
                  },
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <CardContent sx={{ textAlign: 'center', flexGrow: 1, p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    {area.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                    {area.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {area.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large" 
            onClick={() => navigate('/practice-areas')}
            sx={{ fontWeight: 600 }}
          >
            View All Practice Areas
          </Button>
        </Box>

        {/* Why Choose Us Section */}
        <Box sx={{ mt: 14, mb: 10 }}>
          <Typography variant="h2" component="h2" gutterBottom textAlign="center" sx={{ mb: 2 }}>
            Why Choose Our Legal Counsel
          </Typography>
          <Typography 
            variant="subtitle1" 
            textAlign="center" 
            color="text.secondary"
            sx={{ mb: 8, maxWidth: '700px', mx: 'auto', fontSize: '1.1rem' }}
          >
            We are committed to providing exceptional legal representation with integrity and dedication
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 5, height: '100%', backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid', borderColor: 'primary.light', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 3 }}>
                  Experienced Legal Team
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  Our attorneys bring decades of combined experience and a track record of success in various areas of law, ensuring you receive expert guidance for your specific situation.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 5, height: '100%', backgroundColor: 'primary.main', color: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Client-Focused Approach
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  We prioritize understanding your unique needs and provide personalized legal solutions tailored to your situation, with clear communication throughout the process.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 5, height: '100%', backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid', borderColor: 'primary.light', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 3 }}>
                  Proven Track Record
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  Our firm has successfully handled numerous complex cases and achieved favorable outcomes for our clients, building a reputation for excellence in legal counseling.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action Section */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 10,
            px: { xs: 3, md: 8 },
            backgroundColor: 'rgba(0, 40, 85, 0.03)',
            border: '1px solid',
            borderColor: 'primary.light',
            borderRadius: 4,
            mt: 10,
            mb: 8,
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontFamily: '"Merriweather", serif', mb: 3 }}>
            Ready to Discuss Your Case?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, maxWidth: 'md', mx: 'auto', fontWeight: 400, color: 'text.secondary' }}>
            Contact us today for a confidential consultation with our experienced legal team. We're here to protect your rights and interests.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{ 
                py: 2, 
                px: 4, 
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              Schedule Consultation
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/about')}
              sx={{ 
                py: 2, 
                px: 4, 
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              Meet Our Attorneys
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Home;