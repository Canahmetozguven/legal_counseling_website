import axiosInstance from './axiosConfig';

const contactService = {
  submitContact: async contactData => {
    const response = await axiosInstance.post('/contact', contactData);
    return response.data;
  },

  getContacts: async () => {
    const response = await axiosInstance.get('/contact');
    return response.data;
  },
};

export default contactService;
