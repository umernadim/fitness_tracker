import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUser } from '../data/mockData';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/localStorage';

const AuthContext = createContext();

const STORAGE_KEY_AUTH = 'fitnexus_auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getStorageItem(STORAGE_KEY_AUTH, initialUser);
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = getStorageItem(STORAGE_KEY_AUTH, null);
    return Boolean(stored);
  });

  useEffect(() => {
    if (user) {
      setStorageItem(STORAGE_KEY_AUTH, user);
    }
  }, [user]);

  const login = (email, password) => {
    // Simulated authentication logic ready for backend API replacement
    const loggedInUser = {
      ...user,
      email: email || user.email,
      name: email ? email.split('@')[0].replace(/[._]/g, ' ') : user.name
    };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setStorageItem(STORAGE_KEY_AUTH, loggedInUser);
    return { success: true };
  };

  const register = ({ name, email, password }) => {
    const newUser = {
      ...initialUser,
      id: `usr-${Date.now()}`,
      name: name || 'Fitness Athlete',
      email: email,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setStorageItem(STORAGE_KEY_AUTH, newUser);
    return { success: true };
  };

  const logout = () => {
    removeStorageItem(STORAGE_KEY_AUTH);
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      setStorageItem(STORAGE_KEY_AUTH, updated);
      return updated;
    });
  };

  const updatePreferences = (newPrefs) => {
    setUser(prev => {
      const updated = {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...newPrefs
        }
      };
      setStorageItem(STORAGE_KEY_AUTH, updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        updatePreferences
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
