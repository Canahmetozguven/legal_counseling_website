import axiosInstance from './axiosConfig';

const homeCardService = {
  // Get all home cards
  getAllHomeCards: async () => {
    try {
      const response = await axiosInstance.get('/api/home-cards');
      return response.data;
    } catch (error) {
      console.error('Error fetching home cards:', error);
      throw error;
    }
  },

  // Get a single home card by ID
  getHomeCard: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/home-cards/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching home card with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new home card
  createHomeCard: async (cardData) => {
    try {
      const response = await axiosInstance.post('/api/home-cards', cardData);
      return response.data;
    } catch (error) {
      console.error('Error creating home card:', error);
      throw error;
    }
  },

  // Update a home card
  updateHomeCard: async (id, cardData) => {
    try {
      const response = await axiosInstance.patch(`/api/home-cards/${id}`, cardData);
      return response.data;
    } catch (error) {
      console.error(`Error updating home card with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a home card
  deleteHomeCard: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/home-cards/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting home card with ID ${id}:`, error);
      throw error;
    }
  },

  // Update the order of multiple cards
  updateCardsOrder: async (cardsArray) => {
    try {
      const response = await axiosInstance.patch('/api/home-cards/order', { cards: cardsArray });
      return response.data;
    } catch (error) {
      console.error('Error updating home cards order:', error);
      throw error;
    }
  },

  // Upload an image for a home card
  uploadCardImage: async (formData) => {
    try {
      const response = await axiosInstance.post('/api/home-cards/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

export default homeCardService;