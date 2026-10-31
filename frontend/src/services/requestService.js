import api from './api';

export const requestService = {
  createRequest: async (requestData) => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },

  respondToRequest: async (requestId, action, responseNote = '') => {
    const response = await api.put(`/requests/${requestId}/respond`, {
      action,
      responseNote,
    });
    return response.data;
  },

  updateLifecycleStatus: async (requestId, status, note = '', otp = '') => {
    const response = await api.put(`/requests/${requestId}/status`, {
      status,
      note,
      otp,
    });
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/requests/my-requests');
    return response.data;
  },
};
