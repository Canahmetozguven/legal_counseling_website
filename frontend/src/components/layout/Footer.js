import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a237e',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              123 Law Street
              <br />
              Cityville, ST 12345
              <br />
              Phone: (555) 123-4567
              <br />
              Email: info@lawfirm.com
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Practice Areas
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Corporate Law
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Civil Litigation
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Family Law
            </Link>
            <Link href="#" color="inherit" display="block">
              Real Estate Law
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link 
              component="button"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
              onClick={() => navigate('/about')}
            >
              About Us
            </Link>
            <Link
              component="button"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
              onClick={() => navigate('/contact')}
            >
              Contact
            </Link>
            <Link
              component="button"
              color="inherit"
              display="block"
              onClick={() => navigate('/blog')}
            >
              Blog
            </Link>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Law Firm. All rights reserved.
          <br />
          The information on this website is for general information purposes only.
          Nothing on this site should be taken as legal advice.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;