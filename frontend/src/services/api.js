import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Centralized Axios instance for FitNexus Backend APIs
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Automatically attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitnexus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global error handler
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 Unauthorized received on protected route, clean stored token
      console.warn('[API] Authorization token invalid or expired.');
      // Optional: don't immediately redirect on login/register endpoints
      const isAuthPath = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthPath) {
        localStorage.removeItem('fitnexus_token');
        localStorage.removeItem('fitnexus_auth_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
