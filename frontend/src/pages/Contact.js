import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import contactService from '../api/contactService';
import { motion } from 'framer-motion';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await contactService.submitContact(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      toast.success('Your message has been sent successfully. We will contact you soon.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <LocationOnIcon fontSize="large" color="primary" />,
      title: 'Office Location',
      content: '123 Law Street, Cityville, ST 12345',
    },
    {
      icon: <PhoneIcon fontSize="large" color="primary" />,
      title: 'Phone Numbers',
      content: 'Main: (555) 123-4567\nEmergency: (555) 999-8888',
    },
    {
      icon: <EmailIcon fontSize="large" color="primary" />,
      title: 'Email',
      content: 'info@lawfirm.com',
    },
    {
      icon: <AccessTimeIcon fontSize="large" color="primary" />,
      title: 'Office Hours',
      content: 'Monday - Friday: 9:00 AM - 5:00 PM\nWeekends: By appointment only',
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 'md' }}>
            Get in touch with our experienced legal team for a consultation about your case.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4 }}>
              {success && (
                <Alert severity="success" sx={{ mb: 4 }}>
                  Your message has been sent successfully. We'll contact you soon.
                </Alert>
              )}

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h4" gutterBottom>
                  Send Us a Message
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4 }}>
                  Please fill out the form below and we'll get back to you as soon as possible.
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'Name' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'Email' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'Message' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={loading}
                        sx={{ py: 1.5 }}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </motion.div>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Grid container spacing={3}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} key={index}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {info.icon}
                        <Typography variant="h6" sx={{ ml: 2 }}>
                          {info.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: 'pre-line', color: 'text.secondary' }}
                      >
                        {info.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                mt: 4,
                p: 3,
                bgcolor: 'secondary.light',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Need Immediate Legal Assistance?
              </Typography>
              <Typography variant="body1">
                For urgent legal matters outside business hours, please call our emergency hotline:
              </Typography>
              <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
                (555) 999-8888
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8, mb: 4 }}>
          <Divider sx={{ mb: 6 }} />
          <Typography variant="h4" gutterBottom textAlign="center">
            Visit Our Office
          </Typography>
          <Paper elevation={3} sx={{ height: 400, mt: 4 }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Map integration will be added here
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Contact;
