import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { authService } from '../services/authService';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request' | 'reset' | 'completed'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setStep('reset');
      } else {
        setStep('completed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to process password recovery. Please check your email.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authService.resetPassword({
        resetToken,
        password: newPassword,
        confirmPassword,
      });
      setMessage(res.message || 'Password successfully reset!');
      setStep('completed');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to reset password. The recovery token may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="auth-card">
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
            Account Password Recovery
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            {step === 'request'
              ? 'Enter your registered email address to generate password reset instructions.'
              : step === 'reset'
              ? 'Enter your new secure password using the generated recovery token.'
              : 'Password recovery successful.'}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #EF4444',
              color: '#F87171',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {step === 'completed' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} color="var(--primary-teal)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Password Successfully Updated</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Your account password has been updated. You can now log in to your FitNexus dashboard.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', display: 'inline-block', textAlign: 'center' }}>
              Proceed to Sign In
            </Link>
          </div>
        ) : step === 'reset' ? (
          <form onSubmit={handleResetPassword}>
            <div
              style={{
                background: 'rgba(22, 184, 176, 0.1)',
                border: '1px solid var(--primary-teal)',
                color: 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                marginBottom: '16px',
              }}
            >
              🔑 <strong>Recovery Token:</strong> <code style={{ color: 'var(--primary-teal)', wordBreak: 'break-all' }}>{resetToken}</code>
            </div>

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              icon={KeyRound}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              icon={KeyRound}
              required
            />

            <Button
              variant="primary"
              type="submit"
              size="lg"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </Button>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setStep('request')}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ArrowLeft size={14} /> Back to Email Input
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRequestToken}>
            <Input
              label="Registered Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@fitnexus.io"
              icon={Mail}
              required
            />

            <Button
              variant="primary"
              type="submit"
              size="lg"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Send Recovery Token'}
            </Button>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Link
                to="/login"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
