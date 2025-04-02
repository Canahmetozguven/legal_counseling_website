import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Divider,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import aboutService from '../../api/aboutService';
import SEO from '../../utils/seo/SEO';
import { getAttorneySchema } from '../../utils/seo/SchemaTemplates';

const TeamMemberDetail = () => {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        setLoading(true);
        const response = await aboutService.getAboutContent();
        
        // Extract the about data from the nested structure
        const aboutContent = response.data?.data?.about || response.data?.about || null;
        
        if (!aboutContent || !aboutContent.teamMembers) {
          throw new Error('Team member data not found');
        }
        
        // Find the specific team member by ID
        const foundMember = aboutContent.teamMembers.find(m => m._id === memberId);
        
        if (!foundMember) {
          throw new Error('Team member not found');
        }
        
        setMember(foundMember);
      } catch (error) {
        console.error('Error fetching team member details:', error);
        setError(error.message || 'Failed to load team member details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchMemberDetails();
    }
  }, [memberId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button 
          component={Link} 
          to="/about" 
          startIcon={<ArrowBackIcon />}
          variant="contained"
        >
          Back to Team
        </Button>
      </Container>
    );
  }

  if (!member) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="info" sx={{ mb: 2 }}>Team member not found.</Alert>
        <Button 
          component={Link} 
          to="/about" 
          startIcon={<ArrowBackIcon />}
          variant="contained"
        >
          Back to Team
        </Button>
      </Container>
    );
  }

  // Create structured data for the attorney
  const attorneySchema = getAttorneySchema({
    name: member.name,
    jobTitle: member.title,
    description: member.description,
    image: member.image,
    url: window.location.href,
  });

  return (
    <>
      <SEO
        title={`${member.name} | Attorney Profile | Musti Attorneys`}
        description={`Learn more about ${member.name}, ${member.title} at Musti Attorneys. Professional experience, expertise, and background information.`}
        keywords={["attorney profile", member.name, "lawyer", "legal expertise", "attorney bio", member.title]}
        schema={attorneySchema}
      />
      
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Button 
              component={Link} 
              to="/about" 
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 2 }}
            >
              Back to Team
            </Button>
            
            <Card elevation={3}>
              <Grid container>
                {/* Team Member Image */}
                <Grid item xs={12} md={4} sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'primary.light',
                  p: 4 
                }}>
                  <Avatar
                    src={member.image ? 
                      member.image.startsWith('http') 
                        ? member.image 
                        : `http://localhost:5000/uploads/${member.image}`
                      : null}
                    alt={member.name}
                    sx={{
                      width: 200,
                      height: 200,
                      border: '4px solid',
                      borderColor: 'white',
                    }}
                  />
                </Grid>
                
                {/* Team Member Info */}
                <Grid item xs={12} md={8}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom color="primary">
                      {member.name}
                    </Typography>
                    <Typography variant="h6" color="primary.dark" gutterBottom>
                      {member.title}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" paragraph>
                      {member.description || 'No additional information available.'}
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Box>
          
          {/* Areas of Expertise section */}
          {member.expertise && member.expertise.length > 0 && (
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalLibraryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" color="primary">
                  Areas of Expertise
                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {member.expertise.map((area, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        backgroundColor: 'primary.light',
                        borderRadius: 1,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {area}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
          
          {/* Education and Awards section */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* Education column */}
            {member.education && member.education.length > 0 && (
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5" color="primary">
                      Education
                    </Typography>
                  </Box>
                  <List>
                    {member.education.map((edu, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <SchoolIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={edu} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}
            
            {/* Awards column */}
            {member.awards && member.awards.length > 0 && (
              <Grid item xs={12} md={member.education && member.education.length > 0 ? 6 : 12}>
                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WorkspacePremiumIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5" color="primary">
                      Awards & Recognition
                    </Typography>
                  </Box>
                  <List>
                    {member.awards.map((award, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <WorkspacePremiumIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={award} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}
          </Grid>
          
          {/* Contact section */}
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Contact {member.name}
            </Typography>
            
            {member.contact && (member.contact.email || member.contact.phone) ? (
              <>
                <Box sx={{ mt: 2, mb: 3 }}>
                  {member.contact.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon color="primary" sx={{ mr: 2 }} />
                      <Typography variant="body1">
                        {member.contact.email}
                      </Typography>
                    </Box>
                  )}
                  
                  {member.contact.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon color="primary" sx={{ mr: 2 }} />
                      <Typography variant="body1">
                        {member.contact.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <Typography variant="body1" paragraph>
                To schedule a consultation with {member.name}, please use our appointment booking system or contact our office directly.
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" component={Link} to="/contact">
                Contact Us
              </Button>
              <Button variant="outlined" color="primary" component={Link} to="/appointment">
                Schedule Appointment
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </>
  );
};

export default TeamMemberDetail;