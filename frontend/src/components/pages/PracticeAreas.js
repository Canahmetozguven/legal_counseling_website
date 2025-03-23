import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';

const practiceAreas = [
  {
    title: 'Corporate Law',
    description: 'Expert legal counsel for businesses of all sizes, including contract negotiations, mergers & acquisitions, and corporate governance.',
    image: '/images/corporate-law.jpg',
  },
  {
    title: 'Real Estate Law',
    description: 'Comprehensive legal services for property transactions, development projects, and real estate disputes.',
    image: '/images/real-estate-law.jpg',
  },
  {
    title: 'Family Law',
    description: 'Compassionate legal support for divorce, child custody, adoption, and other family-related matters.',
    image: '/images/family-law.jpg',
  },
  {
    title: 'Criminal Defense',
    description: 'Strong defense representation for individuals facing criminal charges, from misdemeanors to serious felonies.',
    image: '/images/criminal-law.jpg',
  },
  {
    title: 'Employment Law',
    description: 'Protection of employee rights and employer compliance with workplace regulations and employment contracts.',
    image: '/images/employment-law.jpg',
  },
  {
    title: 'Intellectual Property',
    description: 'Safeguarding your creative works, innovations, and brand through patents, trademarks, and copyrights.',
    image: '/images/ip-law.jpg',
  },
];

const PracticeAreas = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box textAlign="center" mb={6}>
          <Typography
            component="h1"
            variant="h3"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Our Practice Areas
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Expert legal representation across a wide range of specialties
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {practiceAreas.map((area, index) => (
            <Grid item xs={12} sm={6} md={4} key={area.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={area.image}
                    alt={area.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" color="primary">
                      {area.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {area.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default PracticeAreas;
