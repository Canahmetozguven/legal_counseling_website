import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import homeCardService from '../../api/homeCardService';

const HomeCardManagement = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    title: '',
    description: '',
    image: '',
    linkUrl: '',
    linkText: 'Learn More',
    order: 0,
    active: true,
  });

  const imageInputRef = useRef(null);

  // Fetch cards data
  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await homeCardService.getAllHomeCards();
      if (response.data?.homeCards) {
        // Sort cards by order
        const sortedCards = [...response.data.homeCards].sort((a, b) => a.order - b.order);
        setCards(sortedCards);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching home cards:', error);
      setError('Failed to load home cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Open dialog for adding/editing card
  const openCardDialog = (card = null) => {
    if (card) {
      setSelectedCard(card);
      setCardForm({
        title: card.title || '',
        description: card.description || '',
        image: card.image || '',
        linkUrl: card.linkUrl || '',
        linkText: card.linkText || 'Learn More',
        order: card.order || 0,
        active: card.active !== undefined ? card.active : true,
      });
    } else {
      setSelectedCard(null);
      setCardForm({
        title: '',
        description: '',
        image: '',
        linkUrl: '',
        linkText: 'Learn More',
        order: cards.length > 0 ? Math.max(...cards.map(c => c.order || 0)) + 1 : 0,
        active: true,
      });
    }
    setDialogOpen(true);
  };

  // Handle form input changes
  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setCardForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle image upload
  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await homeCardService.uploadCardImage(formData);

      if (response.data?.filename) {
        setCardForm(prev => ({
          ...prev,
          image: response.data.filename,
        }));
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save card (create or update)
  const handleSaveCard = async () => {
    try {
      setLoading(true);

      if (selectedCard) {
        // Update existing card
        await homeCardService.updateHomeCard(selectedCard._id, cardForm);
        toast.success('Card updated successfully!');
      } else {
        // Create new card
        await homeCardService.createHomeCard(cardForm);
        toast.success('Card created successfully!');
      }

      setDialogOpen(false);
      fetchCards(); // Refresh the cards list
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a card
  const handleDeleteCard = async cardId => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      setLoading(true);
      await homeCardService.deleteHomeCard(cardId);
      toast.success('Card deleted successfully!');
      fetchCards(); // Refresh the cards list
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle drag and drop to reorder cards
  const handleDragEnd = async result => {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for each card
    const updatedItems = items.map((card, index) => ({
      ...card,
      order: index,
    }));

    setCards(updatedItems);

    // Update orders in the backend
    try {
      await homeCardService.updateCardsOrder(
        updatedItems.map(card => ({ id: card._id, order: card.order }))
      );
      toast.success('Cards reordered successfully!');
    } catch (error) {
      console.error('Error updating card order:', error);
      toast.error('Failed to update card order. Please try again.');
      fetchCards(); // Reset to original order on error
    }
  };

  // Helper function to get image URL
  const getImageUrl = imagePath => {
    if (!imagePath) return null;

    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Home Page Cards Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage the feature cards that appear on the homepage. Drag to reorder them.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openCardDialog()}
          sx={{ mt: 2 }}
        >
          Add New Card
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && !dialogOpen ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 2 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="home-cards">
              {provided => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {cards.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="No cards found. Add a new card to get started." />
                    </ListItem>
                  ) : (
                    cards.map((card, index) => (
                      <Draggable key={card._id} draggableId={card._id} index={index}>
                        {provided => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              mb: 2,
                              opacity: card.active ? 1 : 0.6,
                              position: 'relative',
                            }}
                          >
                            <Grid container>
                              <Grid item xs={12} sm={3} md={2}>
                                <Box
                                  {...provided.dragHandleProps}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    borderRight: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                >
                                  <DragIndicatorIcon color="action" />
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={9} md={3}>
                                {card.image && (
                                  <Box sx={{ p: 2 }}>
                                    <CardMedia
                                      component="img"
                                      image={getImageUrl(card.image)}
                                      alt={card.title}
                                      sx={{ height: 100, objectFit: 'cover' }}
                                    />
                                  </Box>
                                )}
                              </Grid>
                              <Grid item xs={12} sm={12} md={5}>
                                <CardContent>
                                  <Typography variant="h6">{card.title}</Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {card.description?.length > 100
                                      ? `${card.description.substring(0, 100)}...`
                                      : card.description}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    Link: {card.linkUrl} ({card.linkText})
                                  </Typography>
                                  <Box sx={{ mt: 1 }}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          size="small"
                                          checked={card.active}
                                          onChange={async () => {
                                            try {
                                              const updatedCard = { ...card, active: !card.active };
                                              await homeCardService.updateHomeCard(
                                                card._id,
                                                updatedCard
                                              );
                                              fetchCards();
                                              toast.success(
                                                `Card ${card.active ? 'disabled' : 'enabled'} successfully!`
                                              );
                                            } catch (error) {
                                              toast.error('Failed to update card status.');
                                            }
                                          }}
                                        />
                                      }
                                      label={card.active ? 'Active' : 'Inactive'}
                                    />
                                  </Box>
                                </CardContent>
                              </Grid>
                              <Grid item xs={12} sm={12} md={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                  <IconButton color="primary" onClick={() => openCardDialog(card)}>
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDeleteCard(card._id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </Grid>
                            </Grid>
                          </Card>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      )}

      {/* Dialog for adding/editing cards */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedCard ? 'Edit Card' : 'Add New Card'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={cardForm.title}
                onChange={handleFormChange}
                required
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={cardForm.description}
                onChange={handleFormChange}
                required
                multiline
                rows={3}
                inputProps={{ maxLength: 500 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Card Image
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  onClick={() => imageInputRef.current.click()}
                >
                  Upload Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <TextField
                  fullWidth
                  label="Or enter image URL"
                  name="image"
                  value={cardForm.image}
                  onChange={handleFormChange}
                />
              </Box>

              {cardForm.image && (
                <Box sx={{ mb: 2, maxWidth: 300 }}>
                  <img
                    src={getImageUrl(cardForm.image)}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: 150, objectFit: 'cover' }}
                    onError={e => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.src =
                        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMjAwIDE1MCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZmlsbD0iIzU1NSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Link URL"
                name="linkUrl"
                value={cardForm.linkUrl}
                onChange={handleFormChange}
                placeholder="e.g. /practice-areas"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Link Text"
                name="linkText"
                value={cardForm.linkText}
                onChange={handleFormChange}
                placeholder="e.g. Learn More"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={cardForm.active}
                    onChange={e => setCardForm(prev => ({ ...prev, active: e.target.checked }))}
                    name="active"
                  />
                }
                label={cardForm.active ? 'Active' : 'Inactive'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveCard}
            disabled={!cardForm.title || !cardForm.description || !cardForm.linkUrl || loading}
          >
            {loading ? <CircularProgress size={24} /> : selectedCard ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomeCardManagement;
