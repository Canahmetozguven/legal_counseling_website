import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import aboutService from '../../api/aboutService';

// TabPanel component for tabs in the team member dialog
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`team-member-tabpanel-${index}`}
      aria-labelledby={`team-member-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, pt: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const AboutManagement = () => {
  const [aboutData, setAboutData] = useState({
    mission: '',
    values: [],
    history: '',
    teamMembers: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teamMemberDialog, setTeamMemberDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    title: '',
    image: '',
    description: '',
    order: 0,
    expertise: [],
    education: [],
    awards: [],
    contact: { email: '', phone: '' },
  });
  const [valueDialog, setValueDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const imageInputRef = useRef(null);
  const [tabValue, setTabValue] = useState(0);
  const [expertiseInput, setExpertiseInput] = useState('');
  const [educationInput, setEducationInput] = useState('');
  const [awardInput, setAwardInput] = useState('');

  // Handle tab change in team member dialog
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const response = await aboutService.getAboutContent();

      // Properly extract data from the nested response structure
      // The API returns: { status: 'success', data: { about: {...} } }
      const aboutContent = response.data?.data?.about ||
        response.data?.about ||
        response.data || {
          mission: '',
          values: [],
          history: '',
          teamMembers: [],
        };

      console.log('API Response:', response); // Debug log to see the actual response
      console.log('Extracted About Content:', aboutContent); // Debug log to see what we extracted

      // Ensure all required properties exist
      setAboutData({
        mission: aboutContent.mission || '',
        values: aboutContent.values || [],
        history: aboutContent.history || '',
        teamMembers: aboutContent.teamMembers || [],
      });
    } catch (err) {
      console.error('Error details:', err); // More detailed error logging
      toast.error('Error fetching about content');
      // If fetching fails, set safe default values
      setAboutData({
        mission: '',
        values: [],
        history: '',
        teamMembers: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMemberFormChange = e => {
    const { name, value } = e.target;

    // Handle nested contact object
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setMemberForm(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value,
        },
      }));
    } else {
      setMemberForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveContent = async () => {
    try {
      setLoading(true);
      await aboutService.updateAboutContent(aboutData);
      toast.success('Content updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating content');
    } finally {
      setLoading(false);
    }
  };

  const openTeamMemberDialog = (member = null) => {
    setTabValue(0); // Reset tab to first tab when opening dialog

    if (member) {
      setSelectedMember(member);
      // Ensure all required fields exist even if they weren't previously saved
      setMemberForm({
        ...member,
        expertise: member.expertise || [],
        education: member.education || [],
        awards: member.awards || [],
        contact: member.contact || { email: '', phone: '' },
      });
    } else {
      setSelectedMember(null);
      setMemberForm({
        name: '',
        title: '',
        image: '',
        description: '',
        order: aboutData.teamMembers.length,
        expertise: [],
        education: [],
        awards: [],
        contact: { email: '', phone: '' },
      });
    }
    setTeamMemberDialog(true);
  };

  const handleSaveTeamMember = async () => {
    try {
      setLoading(true);
      setError('');

      if (selectedMember) {
        await aboutService.updateTeamMember(selectedMember._id, memberForm);
      } else {
        await aboutService.addTeamMember(memberForm);
      }

      setTeamMemberDialog(false);
      fetchAboutContent();
      toast.success(selectedMember ? 'Team member updated' : 'Team member added');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving team member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeamMember = async memberId => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await aboutService.deleteTeamMember(memberId);
        fetchAboutContent();
        toast.success('Team member deleted');
      } catch (err) {
        toast.error('Error deleting team member');
      }
    }
  };

  const handleAddValue = () => {
    if (!newValue.trim()) {
      toast.error('Please enter a value');
      return;
    }

    const updatedValues = [...aboutData.values];
    if (editIndex >= 0) {
      updatedValues[editIndex] = newValue;
    } else {
      updatedValues.push(newValue);
    }

    setAboutData(prev => ({
      ...prev,
      values: updatedValues,
    }));
    setNewValue('');
    setEditIndex(-1);
    setValueDialog(false);
  };

  const handleEditValue = (value, index) => {
    setNewValue(value);
    setEditIndex(index);
    setValueDialog(true);
  };

  const handleDeleteValue = index => {
    if (window.confirm('Are you sure you want to delete this value?')) {
      const updatedValues = aboutData.values.filter((_, i) => i !== index);
      setAboutData(prev => ({
        ...prev,
        values: updatedValues,
      }));
    }
  };

  // Helper function to get the correct image URL with fallback
  const getImageUrl = imagePath => {
    if (!imagePath) {
      return '';
    }

    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // For development environment, use the backend directly without /api prefix
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? `${window.location.protocol}//${window.location.hostname}`
        : 'http://localhost:5000';

    // Remove any filename path and ensure path starts directly with the filename
    // This avoids issues with /api or /uploads prefixes
    const filename = imagePath.split('/').pop();

    // Return complete URL pointing directly to uploads folder
    return `${baseUrl}/uploads/${filename}`;
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      // Upload the image
      const response = await aboutService.uploadTeamMemberImage(formData);

      // Debugging log to verify the full response
      console.log('Full image upload response:', response);

      // Correctly access imagePath from response.data.data.imagePath
      const imagePath = response.data?.data?.imagePath;

      if (!imagePath) {
        console.error('Image path is missing in the response:', response);
        toast.error('Failed to retrieve image path from the server.');
        return;
      }

      // Extract only the image filename by removing the base URL and 'uploads/' part
      const imageName = imagePath.split('/').pop();

      // Debugging log to verify the extracted image name
      console.log('Extracted image name:', imageName);

      // Update the form with the image filename
      setMemberForm(prev => ({
        ...prev,
        image: imageName,
      }));
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload image');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add expertise to the team member form
  const handleAddExpertise = () => {
    if (!expertiseInput.trim()) return;

    setMemberForm(prev => ({
      ...prev,
      expertise: [...prev.expertise, expertiseInput.trim()],
    }));
    setExpertiseInput('');
  };

  // Remove expertise from the team member form
  const handleRemoveExpertise = index => {
    setMemberForm(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  // Add education to the team member form
  const handleAddEducation = () => {
    if (!educationInput.trim()) return;

    setMemberForm(prev => ({
      ...prev,
      education: [...prev.education, educationInput.trim()],
    }));
    setEducationInput('');
  };

  // Remove education from the team member form
  const handleRemoveEducation = index => {
    setMemberForm(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Add award to the team member form
  const handleAddAward = () => {
    if (!awardInput.trim()) return;

    setMemberForm(prev => ({
      ...prev,
      awards: [...prev.awards, awardInput.trim()],
    }));
    setAwardInput('');
  };

  // Remove award from the team member form
  const handleRemoveAward = index => {
    setMemberForm(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index),
    }));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4 }}>
        About Page Management
      </Typography>
      {loading && <Typography>Loading content...</Typography>}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mission Statement
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="mission"
                value={aboutData.mission || ''}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />

              <Typography variant="h6" gutterBottom>
                Our Values
              </Typography>
              <Box sx={{ mb: 2 }}>
                <List>
                  {aboutData.values &&
                    aboutData.values.map((value, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <ListItemText primary={value} />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={() => handleEditValue(value, index)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleDeleteValue(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </React.Fragment>
                    ))}
                </List>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setNewValue('');
                    setEditIndex(-1);
                    setValueDialog(true);
                  }}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Add Value
                </Button>
              </Box>

              <Typography variant="h6" gutterBottom>
                History
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="history"
                value={aboutData.history || ''}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveContent}
                disabled={loading}
              >
                Save Content
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Team Members</Typography>
            <Button variant="contained" color="primary" onClick={() => openTeamMemberDialog()}>
              Add Team Member
            </Button>
          </Box>

          <Grid container spacing={2}>
            {aboutData.teamMembers &&
              aboutData.teamMembers.map(member => (
                <Grid item xs={12} sm={6} md={4} key={member._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {member.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={getImageUrl(member.image)}
                        alt={member.name}
                        sx={{ objectFit: 'cover' }}
                        onError={e => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.onerror = null;
                          e.target.src =
                            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDAwIDIwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZmlsbD0iIzg4OCIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6">{member.name}</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {member.title}
                      </Typography>

                      {member.expertise && member.expertise.length > 0 && (
                        <Box sx={{ mt: 1, mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {member.expertise.slice(0, 2).map((item, i) => (
                            <Chip
                              key={i}
                              label={item}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                          {member.expertise.length > 2 && (
                            <Chip label={`+${member.expertise.length - 2} more`} size="small" />
                          )}
                        </Box>
                      )}

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          startIcon={<VisibilityIcon />}
                          component={Link}
                          to={`/about/team/${member._id}`}
                          target="_blank"
                          size="small"
                          variant="outlined"
                        >
                          Preview
                        </Button>
                        <IconButton size="small" onClick={() => openTeamMemberDialog(member)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteTeamMember(member._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={teamMemberDialog}
        onClose={() => setTeamMemberDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedMember ? 'Edit Team Member' : 'Add Team Member'}
          {selectedMember && (
            <Button
              startIcon={<PreviewIcon />}
              component={Link}
              to={`/about/team/${selectedMember._id}`}
              target="_blank"
              sx={{ position: 'absolute', right: 16, top: 8 }}
              size="small"
            >
              Preview Page
            </Button>
          )}
        </DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Basic Info" />
            <Tab label="Profile Details" />
            <Tab label="Contact Info" />
          </Tabs>
        </Box>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TabPanel value={tabValue} index={0}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={memberForm.name}
              onChange={handleMemberFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={memberForm.title}
              onChange={handleMemberFormChange}
              sx={{ mb: 2 }}
            />

            {/* Image Preview */}
            {memberForm.image && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <img
                  src={
                    memberForm.image.startsWith('http')
                      ? memberForm.image
                      : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${memberForm.image}`
                  }
                  alt="Team member preview"
                  style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                  onError={e => {
                    console.error('Image failed to load:', e.target.src);
                    // If URL contains '/api/uploads/', try removing the '/api' segment
                    if (e.target.src.includes('/api/uploads/')) {
                      const correctedSrc = e.target.src.replace('/api/uploads/', '/uploads/');
                      console.log('Attempting with corrected URL:', correctedSrc);
                      e.target.src = correctedSrc;
                    } else {
                      // Fallback to placeholder if correction doesn't help
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src =
                        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDAwIDIwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZmlsbD0iIzg4OCIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                    }
                  }}
                />
              </Box>
            )}

            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                onClick={() => imageInputRef.current.click()}
              >
                Upload Image
              </Button>
              <TextField
                fullWidth
                label="Or enter image URL"
                name="image"
                value={memberForm.image}
                onChange={handleMemberFormChange}
              />
            </Box>
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={memberForm.description}
              onChange={handleMemberFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Display Order"
              name="order"
              value={memberForm.order}
              onChange={handleMemberFormChange}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Areas of Expertise
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Expertise Area"
                value={expertiseInput}
                onChange={e => setExpertiseInput(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddExpertise();
                  }
                }}
              />
              <Button variant="contained" onClick={handleAddExpertise}>
                Add
              </Button>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {memberForm.expertise.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleRemoveExpertise(index)}
                  color="primary"
                />
              ))}
              {memberForm.expertise.length === 0 && (
                <Typography color="text.secondary" variant="body2">
                  No areas of expertise added yet
                </Typography>
              )}
            </Box>

            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Education"
                value={educationInput}
                onChange={e => setEducationInput(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEducation();
                  }
                }}
                placeholder="e.g. J.D., Harvard Law School, 2010"
              />
              <Button variant="contained" onClick={handleAddEducation}>
                Add
              </Button>
            </Box>

            <List sx={{ mb: 3 }}>
              {memberForm.education.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleRemoveEducation(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {memberForm.education.length === 0 && (
                <Typography color="text.secondary" variant="body2" sx={{ py: 1 }}>
                  No education history added yet
                </Typography>
              )}
            </List>

            <Typography variant="h6" gutterBottom>
              Awards & Recognitions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Award"
                value={awardInput}
                onChange={e => setAwardInput(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAward();
                  }
                }}
                placeholder="e.g. Top 10 Family Law Attorneys, 2022"
              />
              <Button variant="contained" onClick={handleAddAward}>
                Add
              </Button>
            </Box>

            <List>
              {memberForm.awards.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleRemoveAward(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {memberForm.awards.length === 0 && (
                <Typography color="text.secondary" variant="body2" sx={{ py: 1 }}>
                  No awards added yet
                </Typography>
              )}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography color="text.secondary" variant="body2">
              This information will be displayed on the team member&apos;s profile page.
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              name="contact.email"
              value={memberForm.contact?.email || ''}
              onChange={handleMemberFormChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="contact.phone"
              value={memberForm.contact?.phone || ''}
              onChange={handleMemberFormChange}
              sx={{ mb: 2 }}
            />
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTeamMemberDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveTeamMember}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {selectedMember ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={valueDialog} onClose={() => setValueDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex >= 0 ? 'Edit Value' : 'Add Value'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Value"
            fullWidth
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValueDialog(false)}>Cancel</Button>
          <Button onClick={handleAddValue} variant="contained" color="primary">
            {editIndex >= 0 ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AboutManagement;
