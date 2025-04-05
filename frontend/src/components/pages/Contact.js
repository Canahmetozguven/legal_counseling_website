import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import SEO from '../../utils/seo/SEO';
import { getLawFirmSchema } from '../../utils/seo/SchemaTemplates';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({
    type: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', formData);
      setStatus({
        type: 'success',
        message: 'Thank you for your message. We will get back to you soon!',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email',
      content: 'info@lawfirm.com',
      link: 'mailto:info@lawfirm.com',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Office',
      content: '123 Legal Street, Suite 100, City, State 12345',
      link: 'https://maps.google.com/?q=123+Legal+Street+City+State+12345',
    },
  ];

  // Create a detailed law firm schema with full contact information
  const contactSchema = getLawFirmSchema({
    name: 'Musti Attorneys',
    description:
      'Expert legal services for individuals and businesses with personalized attention to your unique needs.',
    url: window.location.origin,
    logo: `${window.location.origin}/logo512.png`,
    address: {
      street: '123 Legal Street, Suite 100',
      city: 'City',
      state: 'State',
      postalCode: '12345',
      country: 'US',
    },
    telephone: '+1 (555) 123-4567',
    email: 'info@lawfirm.com',
  });

  return (
    <>
      <SEO
        title="Contact Our Law Firm | Musti Attorneys"
        description="Contact Musti Attorneys for expert legal advice and representation. Schedule a consultation with our experienced attorneys to discuss your legal needs."
        keywords={[
          'contact attorney',
          'legal consultation',
          'law firm contact',
          'schedule consultation',
          'legal advice',
          'lawyer contact',
        ]}
        schema={contactSchema}
      />

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
              Contact Us
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Get in touch with our legal experts
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Box>
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        mb: 2,
                        transition: '0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                        }}
                      >
                        {info.icon}
                        <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 1 }}>
                          {info.title}
                        </Typography>
                        <Typography
                          component="a"
                          href={info.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'text.secondary',
                            textDecoration: 'none',
                            '&:hover': { color: 'primary.main' },
                          }}
                        >
                          {info.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card sx={{ p: 3 }}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          sx={{ mb: 2 }}
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
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          multiline
                          rows={4}
                          label="Message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      {status.message && (
                        <Grid item xs={12}>
                          <Alert severity={status.type} sx={{ mb: 2 }}>
                            {status.message}
                          </Alert>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          fullWidth
                          disabled={loading}
                        >
                          {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Map */}
          <Box mt={8}>
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.985!3d40.748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcwNC44Ik4gNzPCsDU5JzA2LjAiVw!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
};

export default Contact;
