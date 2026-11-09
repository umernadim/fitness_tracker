import api from './api';

export const goalService = {
  // Get all goals
  getGoals: async (params = {}) => {
    const response = await api.get('/goals', { params });
    return response.data;
  },

  // Get single goal by ID
  getGoalById: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  // Create a fitness goal
  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  // Update a fitness goal (or increment progress)
  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  // Delete a fitness goal
  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
};
