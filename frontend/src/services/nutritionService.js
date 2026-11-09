import api from './api';

export const nutritionService = {
  // Get logged meals
  getMeals: async (params = {}) => {
    const response = await api.get('/nutrition', { params });
    return response.data;
  },

  // Get single meal by ID
  getMealById: async (id) => {
    const response = await api.get(`/nutrition/${id}`);
    return response.data;
  },

  // Log a new meal
  createMeal: async (mealData) => {
    const response = await api.post('/nutrition', mealData);
    return response.data;
  },

  // Update a logged meal
  updateMeal: async (id, mealData) => {
    const response = await api.put(`/nutrition/${id}`, mealData);
    return response.data;
  },

  // Delete a logged meal
  deleteMeal: async (id) => {
    const response = await api.delete(`/nutrition/${id}`);
    return response.data;
  },

  // Get nutrition daily totals summary from MongoDB
  getNutritionSummary: async (date) => {
    const response = await api.get('/nutrition/summary', {
      params: date ? { date } : {},
    });
    return response.data;
  },
};
