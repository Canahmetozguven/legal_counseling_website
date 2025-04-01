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

  // Helper function to get the correct image URL with fallback
  const getImageUrl = (imagePath) => {
    // If no image path provided, return a data URI for a gray placeholder
    if (!imagePath) {
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDAwIDIwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UsIHNhbnMtc2VyaWYiIGZpbGw9IiM1NTU1NTUiPkxlZ2FsIFNlcnZpY2VzPC90ZXh0Pjwvc3ZnPg==';
    }
    
    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // For development environment, use the backend directly
    const baseUrl = process.env.NODE_ENV === 'production'
      ? `${window.location.protocol}//${window.location.hostname}`
      : 'http://localhost:5000';
    
    // For image filenames, make sure they point to backend uploads
    // Strip any leading slashes to avoid double slashes
    const cleanPath = imagePath.replace(/^\/+/, '');
    
    // Return complete URL - ensure no /api/ prefix
    return `${baseUrl}/uploads/${cleanPath}`;
  };

  // Create an onError handler for images
  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    // Use a data URI that complies with CSP rather than an external URL
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDAwIDIwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UsIHNhbnMtc2VyaWYiIGZpbGw9IiNkZDAwMDAiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
  };

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

        <Grid container spacing={4} justifyContent="center">
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
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(area.image)}
                    alt={area.title}
                    sx={{ objectFit: 'cover' }}
                    onError={handleImageError}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
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
