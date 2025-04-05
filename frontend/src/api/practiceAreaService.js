import axios from './axiosConfig';

export const getAllPracticeAreas = () => {
  return axios.get('/practice-areas');
};

export const getPracticeArea = id => {
  return axios.get(`/practice-areas/${id}`);
};

export const createPracticeArea = data => {
  return axios.post('/practice-areas', data);
};

export const updatePracticeArea = (id, data) => {
  return axios.patch(`/practice-areas/${id}`, data);
};

export const deletePracticeArea = id => {
  return axios.delete(`/practice-areas/${id}`);
};

export const uploadPracticeAreaImage = (id, formData) => {
  return axios.post('/practice-areas/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
