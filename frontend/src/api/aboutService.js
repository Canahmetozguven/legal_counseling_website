import axios from './axiosConfig';

export const getAboutContent = () => {
  return axios.get('/about');
};

export const updateAboutContent = (data) => {
  return axios.patch('/about', data);
};

export const getTeamMembers = () => {
  return axios.get('/about/team');
};

export const addTeamMember = (data) => {
  return axios.post('/about/team', data);
};

export const updateTeamMember = (memberId, data) => {
  return axios.patch(`/about/team/${memberId}`, data);
};

export const deleteTeamMember = (memberId) => {
  return axios.delete(`/about/team/${memberId}`);
};

export const uploadTeamMemberImage = (formData) => {
  return axios.post('/about/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const aboutService = {
  getAboutContent,
  updateAboutContent,
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadTeamMemberImage
};

export default aboutService;