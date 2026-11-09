import api from './api';

export const dashboardService = {
  // Get aggregated dashboard statistics
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};
