import api from './api';

export const userService = {
  // Get authenticated user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update authenticated user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('fitnexus_auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};
