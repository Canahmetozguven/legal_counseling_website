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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
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
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
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
          <Button variant="outlined" onClick={() => navigate('/blog')}>
            Read Our Blog
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Expert Legal Advice
              </Typography>
              <Typography>
                Our team of experienced attorneys provides comprehensive legal
                counsel across various practice areas.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Client-Focused Approach
              </Typography>
              <Typography>
                We prioritize understanding your unique needs and developing
                tailored legal solutions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Proven Track Record
              </Typography>
              <Typography>
                Our successful case history demonstrates our commitment to
                achieving the best possible outcomes for our clients.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
