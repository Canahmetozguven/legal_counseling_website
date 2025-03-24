import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import aboutService from '../../api/aboutService';

const AboutManagement = () => {
  const [aboutData, setAboutData] = useState({
    mission: '',
    values: [],
    history: '',
    teamMembers: []
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
    order: 0
  });
  const [valueDialog, setValueDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await aboutService.getAboutContent();
      setAboutData(response.data.about);
    } catch (err) {
      toast.error('Error fetching about content');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberFormChange = (e) => {
    const { name, value } = e.target;
    setMemberForm(prev => ({
      ...prev,
      [name]: value
    }));
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
    if (member) {
      setSelectedMember(member);
      setMemberForm(member);
    } else {
      setSelectedMember(null);
      setMemberForm({
        name: '',
        title: '',
        image: '',
        description: '',
        order: aboutData.teamMembers.length
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

  const handleDeleteTeamMember = async (memberId) => {
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
      values: updatedValues
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

  const handleDeleteValue = (index) => {
    if (window.confirm('Are you sure you want to delete this value?')) {
      const updatedValues = aboutData.values.filter((_, i) => i !== index);
      setAboutData(prev => ({
        ...prev,
        values: updatedValues
      }));
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4 }}>
        About Page Management
      </Typography>
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
                value={aboutData.mission}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />

              <Typography variant="h6" gutterBottom>
                Our Values
              </Typography>
              <Box sx={{ mb: 2 }}>
                <List>
                  {aboutData.values.map((value, index) => (
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
                value={aboutData.history}
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => openTeamMemberDialog()}
            >
              Add Team Member
            </Button>
          </Box>

          <Grid container spacing={2}>
            {aboutData.teamMembers.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{member.name}</Typography>
                    <Typography color="textSecondary">{member.title}</Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => openTeamMemberDialog(member)}
                      >
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedMember ? 'Edit Team Member' : 'Add Team Member'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={memberForm.name}
            onChange={handleMemberFormChange}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={memberForm.title}
            onChange={handleMemberFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={memberForm.image}
            onChange={handleMemberFormChange}
            sx={{ mb: 2 }}
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

      <Dialog
        open={valueDialog}
        onClose={() => setValueDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Value' : 'Add Value'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Value"
            fullWidth
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
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