import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'John Smith',
    title: 'Senior Partner',
    image: '/images/team/john-smith.jpg',
    description: '20+ years of experience in corporate law and mergers & acquisitions.',
  },
  {
    name: 'Sarah Johnson',
    title: 'Managing Partner',
    image: '/images/team/sarah-johnson.jpg',
    description: 'Expert in real estate law and commercial property transactions.',
  },
  {
    name: 'Michael Chen',
    title: 'Associate',
    image: '/images/team/michael-chen.jpg',
    description: 'Specializes in intellectual property and technology law.',
  },
];

const About = () => {
  return (
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

        {/* Mission Statement */}
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
                We are committed to providing exceptional legal services with integrity,
                professionalism, and a deep understanding of our clients' needs. Our mission
                is to deliver innovative legal solutions while maintaining the highest
                standards of ethical conduct.
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h4" color="primary" gutterBottom>
                Our Values
              </Typography>
              <Typography variant="body1" paragraph>
                • Excellence in legal practice<br />
                • Client-centered approach<br />
                • Integrity and transparency<br />
                • Innovation and adaptability<br />
                • Community engagement
              </Typography>
            </motion.div>
          </Grid>
        </Grid>

        {/* Team Section */}
        <Box mb={8}>
          <Typography variant="h4" color="primary" gutterBottom textAlign="center">
            Our Team
          </Typography>
          <Grid container spacing={4} mt={2}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={member.name}>
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
                    <Avatar
                      src={member.image}
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
                        {member.description}
                      </Typography>
                    </CardContent>
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
            Founded in 2000, our firm has grown from a small practice to a respected legal
            institution. Over the years, we have successfully handled thousands of cases,
            built lasting relationships with our clients, and contributed significantly to
            our community's legal landscape.
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default About;
