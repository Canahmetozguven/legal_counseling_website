import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, IconButton, Button, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Footer = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const practiceAreas = [
    { name: 'Corporate Law', path: '/practice-areas#corporate' },
    { name: 'Real Estate Law', path: '/practice-areas#real-estate' },
    { name: 'Family Law', path: '/practice-areas#family' },
    { name: 'Criminal Defense', path: '/practice-areas#criminal' },
    { name: 'Employment Law', path: '/practice-areas#employment' },
    { name: 'Intellectual Property', path: '/practice-areas#ip' },
  ];

  const legalResources = [
    { name: 'Client Resources', path: '/resources/client' },
    { name: 'Legal Articles', path: '/blog' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Testimonials', path: '/testimonials' }
  ];
  
  return (
    <Box component="footer">
      {/* Newsletter/CTA Section */}
      <Box sx={{ 
        bgcolor: 'rgba(0, 40, 85, 0.03)', 
        py: 6,
        borderTop: '1px solid',
        borderColor: 'primary.light',
      }}>
        <Container maxWidth="lg">
          <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 4, 
            backgroundColor: theme.palette.background.paper,
            border: '1px solid rgba(0, 40, 85, 0.1)',
          }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h4" component="h3" sx={{ mb: 2, fontFamily: '"Merriweather", serif', }}>
                  Need Legal Assistance?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  Contact us today for a confidential consultation with our expert legal team. We're ready to help you navigate your legal challenges.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={() => navigate('/contact')}
                  >
                    Schedule Consultation
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="large"
                    onClick={() => navigate('/practice-areas')}
                    endIcon={<ArrowForwardIcon />}
                  >
                    View Our Services
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                      width: 45,
                      height: 45,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <PhoneIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Call Us
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        <Link
                          href="tel:+15551234567"
                          color="text.primary"
                          sx={{ textDecoration: 'none' }}
                        >
                          (555) 123-4567
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                      width: 45,
                      height: 45,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <EmailIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email Us
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        <Link
                          href="mailto:info@lawfirm.com"
                          color="text.primary"
                          sx={{ textDecoration: 'none' }}
                        >
                          info@lawfirm.com
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Main Footer */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontFamily: '"Merriweather", serif', mb: 3 }}>
                LEGAL COUNSEL
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.7, opacity: 0.9 }}>
                Providing exceptional legal services and counsel for individuals and businesses. Our team of experienced attorneys is dedicated to protecting your rights and interests.
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1, mt: 0.3, opacity: 0.9, fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  123 Law Street
                  <br />
                  Cityville, ST 12345
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, opacity: 0.9, fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  <Link
                    href="tel:+15551234567"
                    color="inherit"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    (555) 123-4567
                  </Link>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, opacity: 0.9, fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  <Link
                    href="mailto:info@lawfirm.com"
                    color="inherit"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    info@lawfirm.com
                  </Link>
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
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
                    mb: 1.5,
                    textAlign: 'left',
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {area.name}
                </Link>
              ))}
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Resources
              </Typography>
              {legalResources.map((resource) => (
                <Link
                  key={resource.name}
                  component="button"
                  color="inherit"
                  onClick={() => navigate(resource.path)}
                  sx={{
                    display: 'block',
                    mb: 1.5,
                    textAlign: 'left',
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {resource.name}
                </Link>
              ))}
              <Link
                component="button"
                color="inherit"
                onClick={() => navigate('/about')}
                sx={{
                  display: 'block',
                  mb: 1.5,
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                About Our Firm
              </Link>
              <Link
                component="button"
                color="inherit"
                onClick={() => navigate('/contact')}
                sx={{
                  display: 'block',
                  mb: 1.5,
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Contact Us
              </Link>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Connect With Us
              </Typography>
              <Typography variant="body2" paragraph sx={{ mb: 3, opacity: 0.9, lineHeight: 1.7 }}>
                Follow us on social media for legal insights, firm news, and updates on relevant legal developments.
              </Typography>
              <Box sx={{ mb: 3 }}>
                <IconButton
                  color="inherit"
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  aria-label="Twitter"
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Legal Disclaimers Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.dark,
          color: 'white',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Divider sx={{ mb: 4, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Legal Disclaimer
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, lineHeight: 1.7 }}>
                The information provided on this website is for general informational purposes only and should not be construed as legal advice on any subject matter. No recipients of content from this site should act or refrain from acting on the basis of any content included in the site without seeking the appropriate legal or other professional advice on the particular facts and circumstances at issue from an attorney licensed in the recipient's state.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                The content of this website contains general information and may not reflect current legal developments, verdicts, or settlements. We expressly disclaim all liability in respect to actions taken or not taken based on any or all the contents of this site.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Additional Information
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Link
                    component="button"
                    color="inherit"
                    onClick={() => navigate('/privacy-policy')}
                    sx={{
                      display: 'block',
                      mb: 1.5,
                      textAlign: 'left',
                      textDecoration: 'none',
                      opacity: 0.8,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    component="button"
                    color="inherit"
                    onClick={() => navigate('/terms-of-service')}
                    sx={{
                      display: 'block',
                      mb: 1.5,
                      textAlign: 'left',
                      textDecoration: 'none',
                      opacity: 0.8,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Terms of Service
                  </Link>
                  <Link
                    component="button"
                    color="inherit"
                    onClick={() => navigate('/cookie-policy')}
                    sx={{
                      display: 'block',
                      mb: 1.5,
                      textAlign: 'left',
                      textDecoration: 'none',
                      opacity: 0.8,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Cookie Policy
                  </Link>
                </Box>
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
                  © {new Date().getFullYear()} Legal Counsel. All rights reserved.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
