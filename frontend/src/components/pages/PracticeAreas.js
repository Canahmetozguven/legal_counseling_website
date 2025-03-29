import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { getAllPracticeAreas } from '../../api/practiceAreaService';

const PracticeAreas = () => {
  const navigate = useNavigate();
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPracticeAreas = async () => {
      try {
        const response = await getAllPracticeAreas();
        setPracticeAreas(response.data.data.practiceAreas);
      } catch (error) {
        console.error('Error fetching practice areas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeAreas();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

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
            <Grid item xs={12} sm={6} md={4} key={area._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  onClick={() => navigate(`/practice-areas/${area._id}`)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                    padding: 2,
                    margin: 2,
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
