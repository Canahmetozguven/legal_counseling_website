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
    image: practiceArea.image,
    serviceType: practiceArea.title
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
    practiceArea.title + ' legal advice'
  ];

  return (
    <>
      <SEO
        title={`${practiceArea.title} - Musti Attorneys Legal Services`}
        description={practiceArea.description}
        image={practiceArea.image}
        keywords={keywords}
        schema={practiceAreaSchema}
      />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="400"
            image={practiceArea.image}
            alt={practiceArea.title}
            sx={{ objectFit: 'cover' }}
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

        <Typography 
          variant="h6" 
          color="text.secondary" 
          paragraph
          sx={{ mb: 4 }}
        >
          {practiceArea.description}
        </Typography>

        <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.default' }}>
          <Typography
            variant="body1"
            component="div"
            sx={{
              '& p': { mb: 2 },
              '& ul': { pl: 4, mb: 2 },
              '& li': { mb: 1 }
            }}
            dangerouslySetInnerHTML={{ __html: practiceArea.content }}
          />
        </Paper>
      </Container>
    </>
  );
};

export default PracticeAreaDetail;