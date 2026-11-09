import api from './api';

export const reportService = {
  // Get fitness performance report
  getFitnessReport: async (params = {}) => {
    const response = await api.get('/reports/fitness', { params });
    return response.data;
  },

  // Get nutrition report
  getNutritionReport: async (params = {}) => {
    const response = await api.get('/reports/nutrition', { params });
    return response.data;
  },

  // Download workouts CSV report
  downloadWorkoutsCSV: async () => {
    const response = await api.get('/reports/export/workouts', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fitnexus-workouts-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Download nutrition CSV report
  downloadNutritionCSV: async () => {
    const response = await api.get('/reports/export/nutrition', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fitnexus-nutrition-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
