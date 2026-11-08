import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('alex.rivera@fitnexus.io');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = () => {
    login('alex.rivera@fitnexus.io', 'demo1234');
    navigate('/dashboard');
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-box">
            <div className="brand-icon-box" style={{ width: '42px', height: '42px' }}>
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="brand-text">
              Fit<span>Nexus</span>
            </div>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
            Welcome back, Athlete
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Sign in to access your workout metrics, diet plans, and schedule.
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="auth-demo-box">
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-teal)' }}>
              ⚡ Quick Demo Mode
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Explore with pre-populated fitness data
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={handleDemoLogin}>
            Instant Login
          </Button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#F87171', padding: '10px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="athlete@fitnexus.io"
            icon={Mail}
            required
          />

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--primary-teal)' }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
                style={{ paddingRight: '42px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary-teal)' }}
              />
              Remember my session
            </label>
          </div>

          <Button variant="primary" type="submit" size="lg" style={{ width: '100%' }}>
            Sign In to Dashboard
          </Button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an athlete account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-teal)', fontWeight: 600 }}>
            Join FitNexus
          </Link>
        </div>
      </div>
    </div>
  );
};
