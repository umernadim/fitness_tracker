import api from './api';

export const scheduleService = {
  // Get scheduled activities with date/month filters
  getSchedules: async (params = {}) => {
    const response = await api.get('/schedules', { params });
    return response.data;
  },

  // Get single schedule by ID
  getScheduleById: async (id) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },

  // Create a scheduled activity
  createSchedule: async (scheduleData) => {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  },

  // Update a scheduled activity
  updateSchedule: async (id, scheduleData) => {
    const response = await api.put(`/schedules/${id}`, scheduleData);
    return response.data;
  },

  // Delete a scheduled activity
  deleteSchedule: async (id) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },
};
