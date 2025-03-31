import React from 'react';
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
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import SEO from '../../utils/seo/SEO';
import { getLawFirmSchema } from '../../utils/seo/SchemaTemplates';

const Home = () => {
  const navigate = useNavigate();
  
  // Schema for the law firm
  const lawFirmSchema = getLawFirmSchema({
    url: window.location.origin,
    logo: `${window.location.origin}/logo512.png`
  });

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

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/300x200?law"
                alt="Expert Legal Advice"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Expert Legal Advice
                </Typography>
                <Typography>
                  Our team of experienced attorneys provides comprehensive legal
                  counsel across various practice areas.
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => navigate('/practice-areas')}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/300x200?business"
                alt="Client-Focused Approach"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Client-Focused Approach
                </Typography>
                <Typography>
                  We prioritize understanding your unique needs and developing
                  tailored legal solutions.
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => navigate('/about')}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/300x200?success"
                alt="Proven Track Record"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Proven Track Record
                </Typography>
                <Typography>
                  Our successful case history demonstrates our commitment to
                  achieving the best possible outcomes for our clients.
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => navigate('/cases')}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
