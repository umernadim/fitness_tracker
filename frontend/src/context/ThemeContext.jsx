import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/localStorage';

const ThemeContext = createContext();

const STORAGE_KEY_THEME = 'fitnexus_theme_preferences';

const defaultThemeSettings = {
  theme: 'dark', // Dark theme is standard per requirements
  accentColor: '#16B8B0', // Primary teal
  units: {
    weight: 'kg', // kg or lbs
    height: 'cm', // cm or ft
    water: 'ml', // ml or oz
    energy: 'kcal' // kcal or kJ
  },
  soundEnabled: true,
  hapticFeedback: true
};

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    return getStorageItem(STORAGE_KEY_THEME, defaultThemeSettings);
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEY_THEME, settings);
    // Apply CSS variables or dataset attributes to root element
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.style.setProperty('--primary-teal', settings.accentColor);
  }, [settings]);

  const updateUnits = (newUnits) => {
    setSettings(prev => ({
      ...prev,
      units: { ...prev.units, ...newUnits }
    }));
  };

  const setAccentColor = (color) => {
    setSettings(prev => ({ ...prev, accentColor: color }));
  };

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        units: settings.units,
        theme: settings.theme,
        accentColor: settings.accentColor,
        updateUnits,
        setAccentColor,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
