import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sliders,
  User,
  Settings,
  LogOut,
  ExternalLink,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFitness } from '../../context/FitnessContext';
import { useTheme } from '../../context/ThemeContext';
import { UserAvatar } from '../common/UserAvatar';

export const Navbar = ({ onOpenMobile }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadNotificationsCount, markAsRead } = useFitness();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close flyouts on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/workouts?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      {/* Left Area: Mobile hamburger & Global Search */}
      <div className="navbar-left">
        <button
          type="button"
          className="mobile-menu-trigger"
          onClick={onOpenMobile}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <form onSubmit={handleSearchSubmit} className="navbar-search">
          <Search size={18} className="navbar-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workouts, meals, routines..."
          />
        </form>
      </div>

      {/* Right Area: Theme Toggle, Notifications, User Profile */}
      <div className="navbar-right">
        {/* Quick Theme Toggle */}
        <button
          type="button"
          className="nav-action-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        {/* Notifications Icon with Flyout */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="nav-action-btn"
            onClick={() => setShowNotifications(prev => !prev)}
            aria-label="View notifications"
          >
            <Bell size={19} />
            {unreadNotificationsCount > 0 && (
              <span className="notification-badge">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="dropdown-flyout" style={{ width: '320px' }}>
              <div className="dropdown-header flex justify-between items-center">
                <span className="font-bold text-sm">Notifications</span>
                <button
                  type="button"
                  style={{ fontSize: '0.75rem', color: 'var(--primary-teal)' }}
                  onClick={() => {
                    navigate('/notifications');
                    setShowNotifications(false);
                  }}
                >
                  View All
                </button>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', padding: '6px 4px' }}>
                {notifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      navigate('/notifications');
                      setShowNotifications(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: notif.read ? 'transparent' : 'rgba(22, 184, 176, 0.08)',
                      cursor: 'pointer',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {notif.title}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      {notif.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div ref={userRef} className="user-menu-wrapper">
          <button
            type="button"
            className="user-profile-btn"
            onClick={() => setShowUserMenu(prev => !prev)}
          >
            <UserAvatar src={user?.avatar} size={34} />
            <div className="user-info-text">
              <span className="user-name-text">{user?.name || 'Alex Rivera'}</span>
              <span className="user-badge-text">{user?.membership || 'PRO Elite'}</span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" style={{ marginLeft: '4px' }} />
          </button>

          {showUserMenu && (
            <div className="dropdown-flyout">
              <div className="dropdown-header">
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {user?.email}
                </div>
              </div>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  navigate('/profile');
                  setShowUserMenu(false);
                }}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  navigate('/workouts/manage');
                  setShowUserMenu(false);
                }}
              >
                <Sliders size={16} />
                <span>My Workouts</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  navigate('/settings');
                  setShowUserMenu(false);
                }}
              >
                <Settings size={16} />
                <span>Settings & Units</span>
              </button>

              <div className="dropdown-divider" />

              <button
                type="button"
                className="dropdown-item"
                onClick={handleLogout}
                style={{ color: '#F87171' }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
