import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Card,
  CardMedia,
} from '@mui/material';
import { getPracticeArea } from '../../api/practiceAreaService';
import SEO from '../../utils/seo/SEO';
import { getPracticeAreaSchema } from '../../utils/seo/SchemaTemplates';

const PracticeAreaDetail = () => {
  const { id } = useParams();
  const [practiceArea, setPracticeArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get the correct image URL with fallback
  const getImageUrl = imagePath => {
    // If no image path provided, return a data URI for a gray placeholder
    if (!imagePath) {
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDEyMDAgNDAwIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UsIHNhbnMtc2VyaWYiIGZpbGw9IiM1NTU1NTUiPkxlZ2FsIFNlcnZpY2VzPC90ZXh0Pjwvc3ZnPg==';
    }

    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // For development environment, use the backend directly
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? `${window.location.protocol}//${window.location.hostname}`
        : 'http://localhost:5000';

    // For image filenames, make sure they point to backend uploads
    // Strip any leading slashes to avoid double slashes
    const cleanPath = imagePath.replace(/^\/+/, '');

    // Return complete URL - ensure no /api/ prefix
    return `${baseUrl}/uploads/${cleanPath}`;
  };

  // Create an onError handler for images
  const handleImageError = e => {
    console.error('Image failed to load:', e.target.src);
    // Use a data URI that complies with CSP rather than an external URL
    e.target.src =
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDEyMDAgNDAwIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UsIHNhbnMtc2VyaWYiIGZpbGw9IiNkZDAwMDAiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
  };

  useEffect(() => {
    const fetchPracticeArea = async () => {
      try {
        const response = await getPracticeArea(id);
        setPracticeArea(response.data.data.practiceArea);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load practice area');
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeArea();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  // Generate structured data for this practice area
  const practiceAreaSchema = getPracticeAreaSchema({
    name: practiceArea.title,
    description: practiceArea.description,
    url: window.location.href,
    image: getImageUrl(practiceArea.image),
    serviceType: practiceArea.title,
  });

  // Generate relevant keywords for this practice area
  const keywords = [
    practiceArea.title,
    'legal services',
    'law firm',
    'attorney',
    'legal counsel',
    practiceArea.title + ' attorney',
    practiceArea.title + ' lawyer',
    practiceArea.title + ' legal advice',
  ];

  return (
    <>
      <SEO
        title={`${practiceArea.title} - Musti Attorneys Legal Services`}
        description={practiceArea.description}
        image={getImageUrl(practiceArea.image)}
        keywords={keywords}
        schema={practiceAreaSchema}
      />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="400"
            image={getImageUrl(practiceArea.image)}
            alt={practiceArea.title}
            sx={{ objectFit: 'cover' }}
            onError={handleImageError}
          />
        </Card>

        <Typography
          component="h1"
          variant="h3"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          {practiceArea.title}
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
          {practiceArea.description}
        </Typography>

        <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.default' }}>
          <Typography
            variant="body1"
            component="div"
            sx={{
              '& p': { mb: 2 },
              '& ul': { pl: 4, mb: 2 },
              '& li': { mb: 1 },
            }}
            dangerouslySetInnerHTML={{ __html: practiceArea.content }}
          />
        </Paper>
      </Container>
    </>
  );
};

export default PracticeAreaDetail;
