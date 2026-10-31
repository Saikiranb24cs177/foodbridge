import api from './api';

export const donationService = {
  getAllDonations: async (params = {}) => {
    const response = await api.get('/donations', { params });
    return response.data;
  },

  getDonationById: async (id) => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },

  getMyDonations: async () => {
    const response = await api.get('/donations/my-donations');
    return response.data;
  },

  createDonation: async (donationData) => {
    const response = await api.post('/donations', donationData);
    return response.data;
  },

  updateDonation: async (id, donationData) => {
    const response = await api.put(`/donations/${id}`, donationData);
    return response.data;
  },

  cancelDonation: async (id, reason) => {
    const response = await api.put(`/donations/${id}/cancel`, { reason });
    return response.data;
  },

  reportDonation: async (id, reason) => {
    const response = await api.post(`/donations/${id}/report`, { reason });
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
