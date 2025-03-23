import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  const navigate = useNavigate();

  const practiceAreas = [
    { name: 'Corporate Law', path: '/practice-areas#corporate' },
    { name: 'Real Estate Law', path: '/practice-areas#real-estate' },
    { name: 'Family Law', path: '/practice-areas#family' },
    { name: 'Criminal Defense', path: '/practice-areas#criminal' },
    { name: 'Employment Law', path: '/practice-areas#employment' },
    { name: 'Intellectual Property', path: '/practice-areas#ip' },
  ];
  
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              123 Law Street
              <br />
              Cityville, ST 12345
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Link
                href="tel:+15551234567"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
              >
                Phone: (555) 123-4567
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link
                href="mailto:info@lawfirm.com"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
              >
                Email: info@lawfirm.com
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Practice Areas
            </Typography>
            {practiceAreas.map((area) => (
              <Link
                key={area.name}
                component="button"
                color="inherit"
                onClick={() => navigate(area.path)}
                sx={{
                  display: 'block',
                  mb: 1,
                  textAlign: 'left',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.light' }
                }}
              >
                {area.name}
              </Link>
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Link
              component="button"
              color="inherit"
              onClick={() => navigate('/about')}
              sx={{
                display: 'block',
                mb: 1,
                textAlign: 'left',
                textDecoration: 'none',
                '&:hover': { color: 'primary.light' }
              }}
            >
              About Us
            </Link>
            <Link
              component="button"
              color="inherit"
              onClick={() => navigate('/blog')}
              sx={{
                display: 'block',
                mb: 1,
                textAlign: 'left',
                textDecoration: 'none',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Blog
            </Link>
            <Link
              component="button"
              color="inherit"
              onClick={() => navigate('/contact')}
              sx={{
                display: 'block',
                mb: 1,
                textAlign: 'left',
                textDecoration: 'none',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Contact
            </Link>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Follow Us
              </Typography>
              <Box>
                <IconButton
                  color="inherit"
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 1, '&:hover': { color: 'primary.light' } }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 1, '&:hover': { color: 'primary.light' } }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 1, '&:hover': { color: 'primary.light' } }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ '&:hover': { color: 'primary.light' } }}
                >
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {new Date().getFullYear()} Legal Counsel. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            The information on this website is for general information purposes only.
            Nothing on this site should be taken as legal advice.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;