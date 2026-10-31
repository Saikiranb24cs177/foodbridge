import api from './api';

export const adminService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, updates) => {
    const response = await api.put(`/admin/users/${userId}`, updates);
    return response.data;
  },

  getReportedDonations: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },

  resolveReport: async (donationId) => {
    const response = await api.put(`/admin/reports/${donationId}/resolve`);
    return response.data;
  },

  deleteDonation: async (donationId) => {
    const response = await api.delete(`/admin/donations/${donationId}`);
    return response.data;
  },
};

export const statsService = {
  getPlatformStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
};
