import axiosInstance from './axiosConfig';

const aboutService = {
  getAboutContent: async () => {
    const response = await axiosInstance.get('/api/about');
    return response.data;
  },

  updateAboutContent: async (data) => {
    const response = await axiosInstance.patch('/api/about', data);
    return response.data;
  },

  getTeamMembers: async () => {
    const response = await axiosInstance.get('/api/about/team');
    return response.data;
  },

  addTeamMember: async (memberData) => {
    const response = await axiosInstance.post('/api/about/team', memberData);
    return response.data;
  },

  updateTeamMember: async (memberId, memberData) => {
    const response = await axiosInstance.patch(`/api/about/team/${memberId}`, memberData);
    return response.data;
  },

  deleteTeamMember: async (memberId) => {
    const response = await axiosInstance.delete(`/api/about/team/${memberId}`);
    return response.data;
  }
};

export default aboutService;