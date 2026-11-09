import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  Sliders,
  Shield,
  Save,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const Settings = () => {
  const { user, updatePreferences } = useAuth();
  const {
    units,
    updateUnits,
    theme,
    toggleTheme,
    accentColor,
    setAccentColor
  } = useTheme();

  const [savedAlert, setSavedAlert] = useState(false);

  // Local state for notification toggles
  const [reminders, setReminders] = useState({
    workout: user?.reminders?.workout ?? true,
    meal: user?.reminders?.meal ?? true,
    water: user?.reminders?.water ?? true,
    notifications: user?.preferences?.notifications ?? true,
    emailNewsletter: user?.preferences?.emailNewsletter ?? true,
    profilePublic: user?.preferences?.profilePublic ?? false
  });

  const accentPalette = [
    { name: 'Emerald Teal (Default)', hex: '#16B8B0' },
    { name: 'Electric Cyan', hex: '#38BDF8' },
    { name: 'Sunset Amber', hex: '#FB923C' },
    { name: 'Neon Orchid', hex: '#F472B6' },
    { name: 'Vibrant Lime', hex: '#10B981' }
  ];

  const handleToggle = (key) => {
    setReminders((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      updatePreferences(next);
      return next;
    });
  };

  const handleUnitChange = (key, val) => {
    updateUnits({ [key]: val });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        'Are you sure you want to clear your local session cache? This will reset your custom additions.'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Application Settings & Preferences</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Configure theme accents, units of measurement, privacy, and automated reminders.
        </p>
      </div>

      {savedAlert && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10B981',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            color: '#34D399',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <CheckCircle size={18} />
          <span>Preferences updated and saved to local storage!</span>
        </div>
      )}

      {/* Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* 1. Theme & Appearance */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Palette size={20} color="var(--primary-teal)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Theme & Visual Style</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem' }}>Color Mode</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Current: {theme === 'dark' ? 'Dark Fitness Studio' : 'High Contrast Light'}
                </span>
              </div>
              <Button variant="secondary" size="sm" onClick={toggleTheme} icon={theme === 'dark' ? Moon : Sun}>
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <strong style={{ display: 'block', fontSize: '0.92rem', marginBottom: '8px' }}>
                Primary Brand Accent Color
              </strong>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {accentPalette.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => setAccentColor(col.hex)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: col.hex,
                      border: accentColor === col.hex ? '3px solid #fff' : '2px solid transparent',
                      boxShadow: accentColor === col.hex ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
                      cursor: 'pointer'
                    }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Units of Measurement */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sliders size={20} color="var(--color-sky)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Units of Measurement</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Weight Unit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Weight System</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${units.weight === 'kg' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUnitChange('weight', 'kg')}
                >
                  kg (Metric)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${units.weight === 'lbs' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUnitChange('weight', 'lbs')}
                >
                  lbs (Imperial)
                </button>
              </div>
            </div>

            {/* Height Unit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Height System</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${units.height === 'cm' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUnitChange('height', 'cm')}
                >
                  cm (Centimeters)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${units.height === 'ft' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUnitChange('height', 'ft')}
                >
                  ft / in
                </button>
              </div>
            </div>

            {/* Water Unit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Hydration Volume</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${units.water === 'ml' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUnitChange('water', 'ml')}
                >
                  ml (Milliliters)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${units.water === 'oz' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUnitChange('water', 'oz')}
                >
                  fl oz
                </button>
              </div>
            </div>

            {/* Energy Unit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Energy Unit</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${units.energy === 'kcal' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUnitChange('energy', 'kcal')}
                >
                  kcal (Calories)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${units.energy === 'kJ' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUnitChange('energy', 'kJ')}
                >
                  kJ (Kilojoules)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Automated Reminders & Alerts */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Bell size={20} color="var(--color-orange)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Notifications & Reminders</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>Workout Reminders</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Receive prompt before scheduled training sessions
                </span>
              </div>
              <input
                type="checkbox"
                checked={reminders.workout}
                onChange={() => handleToggle('workout')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>Meal & Hydration Reminders</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Notifications for water logging & post-workout nutrition
                </span>
              </div>
              <input
                type="checkbox"
                checked={reminders.meal}
                onChange={() => handleToggle('meal')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>In-App Milestone Alerts</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Celebrations when strength PRs and goals are reached
                </span>
              </div>
              <input
                type="checkbox"
                checked={reminders.notifications}
                onChange={() => handleToggle('notifications')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* 4. Privacy & Data Maintenance */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Shield size={20} color="var(--color-pink)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Privacy & Data Maintenance</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>Public Community Profile</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Allow other FitNexus athletes to see your public workouts
                </span>
              </div>
              <input
                type="checkbox"
                checked={reminders.profilePublic}
                onChange={() => handleToggle('profilePublic')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: '#F87171' }}>
                    Reset Local Storage Cache
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Restore original mock data & purge frontend modifications
                  </span>
                </div>
                <Button variant="danger" size="sm" icon={RotateCcw} onClick={handleClearData}>
                  Reset Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
