import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  CardMedia,
  CircularProgress,
  Alert,
  CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import SEO from '../../utils/seo/SEO';
import { getLawFirmSchema } from '../../utils/seo/SchemaTemplates';
import homeCardService from '../../api/homeCardService';

const Home = () => {
  const navigate = useNavigate();
  const [homeCards, setHomeCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Schema for the law firm
  const lawFirmSchema = getLawFirmSchema({
    url: window.location.origin,
    logo: `${window.location.origin}/logo512.png`
  });

  useEffect(() => {
    const fetchHomeCards = async () => {
      try {
        setLoading(true);
        const response = await homeCardService.getAllHomeCards();
        
        // If there are no cards in the database, use default cards
        if (response.data.homeCards && response.data.homeCards.length > 0) {
          setHomeCards(response.data.homeCards);
        } else {
          // Default cards if none exist in the database
          setHomeCards([
            {
              title: 'Expert Legal Advice',
              description: 'Our team of experienced attorneys provides comprehensive legal counsel across various practice areas.',
              image: 'https://source.unsplash.com/random/300x200?law',
              linkUrl: '/practice-areas',
              linkText: 'Learn More'
            },
            {
              title: 'Client-Focused Approach',
              description: 'We prioritize understanding your unique needs and developing tailored legal solutions.',
              image: 'https://source.unsplash.com/random/300x200?business',
              linkUrl: '/about',
              linkText: 'Learn More'
            },
            {
              title: 'Proven Track Record',
              description: 'Our successful case history demonstrates our commitment to achieving the best possible outcomes for our clients.',
              image: 'https://source.unsplash.com/random/300x200?success',
              linkUrl: '/cases',
              linkText: 'Learn More'
            }
          ]);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching home cards:', error);
        setError('Failed to load content. Please try again later.');
        
        // Use default cards on error
        setHomeCards([
          {
            title: 'Expert Legal Advice',
            description: 'Our team of experienced attorneys provides comprehensive legal counsel across various practice areas.',
            image: 'https://source.unsplash.com/random/300x200?law',
            linkUrl: '/practice-areas',
            linkText: 'Learn More'
          },
          {
            title: 'Client-Focused Approach',
            description: 'We prioritize understanding your unique needs and developing tailored legal solutions.',
            image: 'https://source.unsplash.com/random/300x200?business',
            linkUrl: '/about',
            linkText: 'Learn More'
          },
          {
            title: 'Proven Track Record',
            description: 'Our successful case history demonstrates our commitment to achieving the best possible outcomes for our clients.',
            image: 'https://source.unsplash.com/random/300x200?success',
            linkUrl: '/cases',
            linkText: 'Learn More'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeCards();
  }, []);

  // Helper function to get the correct image URL path
  const getImageUrl = (imagePath) => {
    // If no image path provided, return a default image
    if (!imagePath) return 'https://source.unsplash.com/random/300x200?law';
    
    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // For development environment, use the backend directly
    const baseUrl = process.env.NODE_ENV === 'production'
      ? `${window.location.protocol}//${window.location.hostname}`
      : 'http://localhost:5000';
    
    // Strip any leading slashes or 'uploads/' to avoid path issues
    const cleanPath = imagePath.replace(/^\/?(uploads\/)?/i, '').replace(/^\/+/, '');
    
    // Return complete URL
    return `${baseUrl}/uploads/${cleanPath}`;
  };

  // Card component to keep things DRY
  const HomeCard = ({ card, index }) => (
    <Grid item xs={12} sm={6} md={4} key={card._id || index}>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6
        }
      }}>
        <CardActionArea 
          onClick={() => navigate(card.linkUrl)}
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
        >
          <CardMedia
            component="img"
            height="140"
            image={getImageUrl(card.image)}
            alt={card.title}
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
              // If URL contains '/api/uploads/', try removing the '/api' segment
              if (e.target.src.includes('/api/uploads/')) {
                const correctedSrc = e.target.src.replace('/api/uploads/', '/uploads/');
                console.log('Attempting with corrected URL:', correctedSrc);
                e.target.src = correctedSrc;
              } else {
                // Fallback to placeholder if correction doesn't help
                e.target.src = 'https://source.unsplash.com/random/300x200?law';
              }
            }}
          />
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography gutterBottom variant="h5" component="h2">
              {card.title}
            </Typography>
            <Typography sx={{ flexGrow: 1 }}>
              {card.description}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Typography variant="button" color="primary" sx={{ mr: 1 }}>
                {card.linkText || 'Learn More'}
              </Typography>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );

  return (
    <>
      <SEO
        title="Musti Attorneys - Expert Legal Services & Representation"
        description="Dedicated legal counsel for individuals and businesses. Our experienced attorneys provide expert guidance across various practice areas including corporate law, civil litigation, and family law."
        keywords={["legal services", "attorney", "law firm", "legal counsel", "lawyer", "litigation", "corporate law", "family law"]}
        schema={lawFirmSchema}
      />
      
      <Container>
        <Box sx={{ pt: 8, pb: 6 }}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Welcome to Our Legal Practice
          </Typography>
          <Typography variant="h5" align="center" color="text.primary" paragraph>
            Professional legal counsel dedicated to protecting your rights and interests.
            With years of experience, we provide expert guidance across various areas of law.
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button variant="contained" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
            <Button variant="contained" onClick={() => navigate('/blog')}>
              Read Our Blog
            </Button>
          </Stack>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        ) : (
          <Grid container spacing={4}>
            {homeCards.map((card, index) => (
              <HomeCard key={card._id || index} card={card} index={index} />
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Home;
