import axios from './axiosConfig';

export const getAllPracticeAreas = () => {
  return axios.get('/api/practice-areas');
};

export const getPracticeArea = (id) => {
  return axios.get(`/api/practice-areas/${id}`);
};

export const createPracticeArea = (data) => {
  return axios.post('/api/practice-areas', data);
};

export const updatePracticeArea = (id, data) => {
  return axios.patch(`/api/practice-areas/${id}`, data);
};

export const deletePracticeArea = (id) => {
  return axios.delete(`/api/practice-areas/${id}`);
};