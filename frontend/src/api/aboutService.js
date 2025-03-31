import axiosInstance from './axiosConfig';

const aboutService = {
  getAboutContent: async () => {
    const response = await axiosInstance.get('/about');
    return response.data;
  },

  updateAboutContent: async (data) => {
    const response = await axiosInstance.patch('/about', data);
    return response.data;
  },

  getTeamMembers: async () => {
    const response = await axiosInstance.get('/about/team');
    return response.data;
  },

  addTeamMember: async (memberData) => {
    const response = await axiosInstance.post('/about/team', memberData);
    return response.data;
  },

  updateTeamMember: async (memberId, memberData) => {
    const response = await axiosInstance.patch(`/about/team/${memberId}`, memberData);
    return response.data;
  },

  deleteTeamMember: async (memberId) => {
    const response = await axiosInstance.delete(`/about/team/${memberId}`);
    return response.data;
  }
};

export default aboutService;