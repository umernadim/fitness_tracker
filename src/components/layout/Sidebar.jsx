import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Dumbbell,
  Utensils,
  Target,
  Calendar,
  TrendingUp,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  Bell,
  FileText,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFitness } from '../../context/FitnessContext';

export const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { unreadNotificationsCount } = useFitness();

  // Submenu expansion states
  const [workoutExpanded, setWorkoutExpanded] = useState(
    location.pathname.startsWith('/workouts')
  );
  const [dietExpanded, setDietExpanded] = useState(
    location.pathname.startsWith('/diet')
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${
        isMobileOpen ? 'mobile-open' : ''
      }`}
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        <NavLink
          to="/dashboard"
          className="sidebar-brand"
          onClick={onCloseMobile}
        >
          <div className="brand-icon-box">
            <Zap size={22} fill="currentColor" />
          </div>
          {!isCollapsed && (
            <div className="brand-text">
              Fit<span>Nexus</span>
            </div>
          )}
        </NavLink>

        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>

        {/* 1. Overview */}
        <div className="nav-item-wrapper">
          <NavLink
            to="/dashboard"
            className={navClass}
            onClick={onCloseMobile}
            title="Overview"
          >
            <div className="nav-link-content">
              <Activity size={20} />
              <span className="nav-label">Overview</span>
            </div>
          </NavLink>
        </div>

        {/* 2. Workout (with submenu) */}
        <div className="nav-item-wrapper">
          <div
            className={`nav-link ${
              location.pathname.startsWith('/workouts') ? 'active' : ''
            }`}
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              setWorkoutExpanded(prev => !prev);
            }}
            title="Workout"
          >
            <div className="nav-link-content">
              <Dumbbell size={20} />
              <span className="nav-label">Workout</span>
            </div>
            {!isCollapsed && (
              <span className="nav-arrow">
                {workoutExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
          </div>

          {!isCollapsed && workoutExpanded && (
            <div className="nav-submenu">
              <NavLink
                to="/workouts"
                end
                className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
              >
                • Discover Workouts
              </NavLink>
              <NavLink
                to="/workouts/manage"
                className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
              >
                • Manage & Log
              </NavLink>
            </div>
          )}
        </div>

        {/* 3. Diet Plan (with submenu) */}
        <div className="nav-item-wrapper">
          <div
            className={`nav-link ${
              location.pathname.startsWith('/diet') ? 'active' : ''
            }`}
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              setDietExpanded(prev => !prev);
            }}
            title="Diet Plan"
          >
            <div className="nav-link-content">
              <Utensils size={20} />
              <span className="nav-label">Diet Plan</span>
            </div>
            {!isCollapsed && (
              <span className="nav-arrow">
                {dietExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
          </div>

          {!isCollapsed && dietExpanded && (
            <div className="nav-submenu">
              <NavLink
                to="/diet"
                end
                className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
              >
                • Nutrition Dashboard
              </NavLink>
              <NavLink
                to="/diet/details"
                className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
              >
                • Meal Details & Recipes
              </NavLink>
            </div>
          )}
        </div>

        {/* 4. Goals */}
        <div className="nav-item-wrapper">
          <NavLink
            to="/goals"
            className={navClass}
            onClick={onCloseMobile}
            title="Goals"
          >
            <div className="nav-link-content">
              <Target size={20} />
              <span className="nav-label">Goals</span>
            </div>
          </NavLink>
        </div>

        {/* 5. My Schedule */}
        <div className="nav-item-wrapper">
          <NavLink
            to="/schedule"
            className={navClass}
            onClick={onCloseMobile}
            title="My Schedule"
          >
            <div className="nav-link-content">
              <Calendar size={20} />
              <span className="nav-label">My Schedule</span>
            </div>
          </NavLink>
        </div>

        {/* 6. Progress */}
        <div className="nav-item-wrapper">
          <NavLink
            to="/progress"
            className={navClass}
            onClick={onCloseMobile}
            title="Progress"
          >
            <div className="nav-link-content">
              <TrendingUp size={20} />
              <span className="nav-label">Progress</span>
            </div>
          </NavLink>
        </div>

        {/* 7. Reports */}
        <div className="nav-item-wrapper">
          <NavLink
            to="/reports"
            className={navClass}
            onClick={onCloseMobile}
            title="Reports"
          >
            <div className="nav-link-content">
              <FileText size={20} />
              <span className="nav-label">Reports</span>
            </div>
          </NavLink>
        </div>

        {/* 8. Notifications */}
        <div className="nav-item-wrapper">
          <NavLink
            to="/notifications"
            className={navClass}
            onClick={onCloseMobile}
            title="Notifications"
          >
            <div className="nav-link-content">
              <Bell size={20} />
              <span className="nav-label">Notifications</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="nav-badge">{unreadNotificationsCount}</span>
            )}
          </NavLink>
        </div>

        <div className="nav-section-label">Account & Preferences</div>

        {/* 9. Profile */}
        <div className="nav-item-wrapper">
          <NavLink
            to="/profile"
            className={navClass}
            onClick={onCloseMobile}
            title="Profile"
          >
            <div className="nav-link-content">
              <User size={20} />
              <span className="nav-label">Profile</span>
            </div>
          </NavLink>
        </div>

        {/* 10. Settings */}
        <div className="nav-item-wrapper">
          <NavLink
            to="/settings"
            className={navClass}
            onClick={onCloseMobile}
            title="Settings"
          >
            <div className="nav-link-content">
              <Settings size={20} />
              <span className="nav-label">Settings</span>
            </div>
          </NavLink>
        </div>

        {/* 11. Logout */}
        <div className="nav-item-wrapper" style={{ marginTop: 'auto' }}>
          <button
            type="button"
            className="nav-link"
            onClick={handleLogout}
            style={{ width: '100%', textAlign: 'left' }}
            title="Logout"
          >
            <div className="nav-link-content">
              <LogOut size={20} color="#F87171" />
              <span className="nav-label" style={{ color: '#F87171' }}>
                Logout
              </span>
            </div>
          </button>
        </div>
      </nav>

      {/* Premium Membership Card at Bottom */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="pro-card">
            <span className="pro-badge">
              <Sparkles size={12} /> FitNexus PRO
            </span>
            <h4 className="pro-title">Unlock Unlimited AI Coaching</h4>
            <p className="pro-desc">
              Personalized macro algorithms, workout video guides & analytics.
            </p>
            <button
              type="button"
              className="pro-btn"
              onClick={() => navigate('/settings')}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
