import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUser } from '../data/mockData';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/localStorage';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

const STORAGE_KEY_AUTH = 'fitnexus_auth_user';
const STORAGE_KEY_TOKEN = 'fitnexus_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getStorageItem(STORAGE_KEY_AUTH, initialUser);
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = getStorageItem(STORAGE_KEY_AUTH, null);
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    return Boolean(stored && token);
  });

  const [loading, setLoading] = useState(false);

  // Synchronize authenticated user from backend on mount if token is stored
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.user) {
            setUser(res.user);
            setIsAuthenticated(true);
            setStorageItem(STORAGE_KEY_AUTH, res.user);
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid:', err.message);
          // If token expired, clear session
          removeStorageItem(STORAGE_KEY_AUTH);
          localStorage.removeItem(STORAGE_KEY_TOKEN);
          setIsAuthenticated(false);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.user && res.token) {
        setUser(res.user);
        setIsAuthenticated(true);
        setStorageItem(STORAGE_KEY_AUTH, res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed.' };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Unable to connect to backend server. Please verify backend is running on port 5000.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async ({ name, email, password, confirmPassword }) => {
    setLoading(true);
    try {
      const res = await authService.register({
        name,
        email,
        password,
        confirmPassword,
      });
      if (res.user && res.token) {
        setUser(res.user);
        setIsAuthenticated(true);
        setStorageItem(STORAGE_KEY_AUTH, res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Registration error. Please check your information and try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('[AuthContext] Error during logout:', err);
    } finally {
      removeStorageItem(STORAGE_KEY_AUTH);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      setIsAuthenticated(false);
    }
  };

  // Profile update handler
  const updateProfile = async (updatedFields) => {
    try {
      const res = await userService.updateProfile(updatedFields);
      if (res.user) {
        setUser(res.user);
        setStorageItem(STORAGE_KEY_AUTH, res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.warn('[AuthContext] Profile update failed online, falling back to local storage:', err);
      // Fallback update
      setUser((prev) => {
        const updated = { ...prev, ...updatedFields };
        setStorageItem(STORAGE_KEY_AUTH, updated);
        return updated;
      });
    }
  };

  // Preferences update handler
  const updatePreferences = async (newPrefs) => {
    try {
      const res = await userService.updateProfile({ preferences: newPrefs });
      if (res.user) {
        setUser(res.user);
        setStorageItem(STORAGE_KEY_AUTH, res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      setUser((prev) => {
        const updated = {
          ...prev,
          preferences: {
            ...prev.preferences,
            ...newPrefs,
          },
        };
        setStorageItem(STORAGE_KEY_AUTH, updated);
        return updated;
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
