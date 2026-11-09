import api from './api';

export const workoutService = {
  // Get all workouts with optional filters
  getWorkouts: async (params = {}) => {
    const response = await api.get('/workouts', { params });
    return response.data;
  },

  // Get single workout by ID
  getWorkoutById: async (id) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  // Log a new workout record
  createWorkout: async (workoutData) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },

  // Update an existing workout record
  updateWorkout: async (id, workoutData) => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data;
  },

  // Delete a workout record
  deleteWorkout: async (id) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  },
};
