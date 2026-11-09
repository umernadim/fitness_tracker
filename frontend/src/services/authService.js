import api from './api';

export const authService = {
  // Register a new athlete account
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('fitnexus_token', response.data.token);
      localStorage.setItem('fitnexus_auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Authenticate user and store JWT token
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('fitnexus_token', response.data.token);
      localStorage.setItem('fitnexus_auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get current authenticated user profile
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout athlete
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('fitnexus_token');
      localStorage.removeItem('fitnexus_auth_user');
    }
    return { success: true };
  },

  // Request password reset token
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password using recovery token
  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    if (response.data.token) {
      localStorage.setItem('fitnexus_token', response.data.token);
      localStorage.setItem('fitnexus_auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};
