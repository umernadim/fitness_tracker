import api from './api';

export const progressService = {
  // Get progress records (chronological order)
  getProgress: async (params = {}) => {
    const response = await api.get('/progress', { params });
    return response.data;
  },

  // Get single progress record
  getProgressById: async (id) => {
    const response = await api.get(`/progress/${id}`);
    return response.data;
  },

  // Record body measurements
  createProgress: async (progressData) => {
    const response = await api.post('/progress', progressData);
    return response.data;
  },

  // Update body measurements
  updateProgress: async (id, progressData) => {
    const response = await api.put(`/progress/${id}`, progressData);
    return response.data;
  },

  // Delete body measurements
  deleteProgress: async (id) => {
    const response = await api.delete(`/progress/${id}`);
    return response.data;
  },

  // Get progress summary calculations
  getProgressSummary: async () => {
    const response = await api.get('/progress/summary');
    return response.data;
  },
};
