import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  CardActionArea,
} from '@mui/material';
import { motion } from 'framer-motion';
import aboutService from '../../api/aboutService';
import SEO from '../../utils/seo/SEO';
import { getLawFirmSchema, getAttorneySchema } from '../../utils/seo/SchemaTemplates';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await aboutService.getAboutContent();
        console.log('About API response:', response); // For debugging
        
        // Fix: Correctly access the nested about data structure
        const aboutContent = response.data?.data?.about || response.data?.about || null;
        console.log('Extracted about content:', aboutContent); // For debugging
        
        setAboutData(aboutContent);
      } catch (error) {
        console.error('Error fetching about content:', error);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  const renderValue = (value, index) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: 'primary.main',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
          >
            <Typography 
              variant="h6" 
              className="contrast"
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                lineHeight: 1.4
              }}
            >
              {value}
            </Typography>
          </Paper>
        </motion.div>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!aboutData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="info">No content available.</Alert>
      </Box>
    );
  }

  // Create structured data for the law firm
  const lawFirmSchema = getLawFirmSchema({
    name: "Musti Attorneys",
    description: aboutData.mission,
    url: window.location.origin,
    logo: `${window.location.origin}/logo512.png`
  });

  // Create structured data for each attorney
  const attorneys = aboutData.teamMembers.map(member => 
    getAttorneySchema({
      name: member.name,
      jobTitle: member.title,
      description: member.description,
      image: member.image,
      url: `${window.location.origin}/about#${member._id}`,
    })
  );

  // Combine all schemas into a single array
  const schemas = [lawFirmSchema, ...attorneys];

  return (
    <>
      <SEO
        title="About Our Law Firm | Musti Attorneys"
        description="Meet our experienced legal team. We're dedicated to providing exceptional legal representation and personalized solutions for all your legal needs."
        keywords={["law firm", "legal team", "attorneys", "legal experience", "about us", "legal expertise", "lawyers"]}
        schema={schemas}
      />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <Box textAlign="center" mb={8}>
            <Typography
              component="h1"
              variant="h3"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              About Our Firm
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Dedicated to Excellence in Legal Services
            </Typography>
          </Box>

          {/* Mission Statement and Values */}
          <Grid container spacing={6} mb={8}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph>
                  {aboutData.mission}
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography variant="h4" color="primary" gutterBottom align="center">
                  Our Values
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  {aboutData.values.map((value, index) => renderValue(value, index))}
                </Grid>
              </motion.div>
            </Grid>
          </Grid>

          {/* Team Section */}
          <Box mb={8}>
            <Typography variant="h4" color="primary" gutterBottom textAlign="center">
              Our Team
            </Typography>
            <Grid container spacing={4} mt={2} justifyContent="center">
              {aboutData.teamMembers
                .sort((a, b) => a.order - b.order)
                .map((member, index) => (
                  <Grid item xs={12} sm={6} md={4} key={member._id} id={member._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 2,
                          transition: '0.3s',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: 6,
                          },
                        }}
                      >
                        <CardActionArea 
                          component={Link} 
                          to={`/about/team/${member._id}`} 
                          sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            p: 1
                          }}
                        >
                          <Avatar
                            src={member.image?.startsWith('http') ? member.image : `${process.env.REACT_APP_API_URL}/uploads/${member.image}`}
                            alt={member.name}
                            sx={{
                              width: 120,
                              height: 120,
                              mb: 2,
                              border: '3px solid',
                              borderColor: 'primary.main',
                            }}
                          />
                          <CardContent>
                            <Typography variant="h6" component="h3" gutterBottom align="center">
                              {member.name}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="primary"
                              gutterBottom
                              align="center"
                            >
                              {member.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                              {member.description && member.description.length > 100 
                                ? `${member.description.substring(0, 100)}...` 
                                : member.description}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="primary" 
                              sx={{ mt: 1, fontWeight: 'bold', textAlign: 'center' }}
                            >
                              View Profile
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* History Section */}
          <Box>
            <Typography variant="h4" color="primary" gutterBottom textAlign="center">
              Our History
            </Typography>
            <Typography variant="body1" paragraph align="center">
              {aboutData.history}
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </>
  );
};

export default About;
