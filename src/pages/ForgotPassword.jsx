import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
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
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} color="var(--primary-teal)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Reset Link Dispatched</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
              We've dispatched a secure recovery code to <strong>{email}</strong>. Check your inbox and follow the steps.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label="Registered Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@domain.com"
              icon={Mail}
              required
            />

            <Button variant="primary" type="submit" size="lg" style={{ width: '100%', marginTop: '10px' }}>
              Send Recovery Link
            </Button>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
