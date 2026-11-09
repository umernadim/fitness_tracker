import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Sparkles,
  Sliders,
  Bell,
  HelpCircle,
  LogOut,
  CheckCircle,
  Save,
  Send,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { progressHistory } = useFitness();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Rivera',
    email: user?.email || 'alex.rivera@fitnexus.io',
    gender: user?.gender || 'Male',
    dob: user?.dob || '1996-05-14',
    height: user?.height || 178,
    weight: user?.weight || 74.5,
    bio: user?.bio || 'Fitness enthusiast striving for functional strength, athletic agility, and balanced holistic nutrition.'
  });

  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');

  // BMI Calculation
  const heightM = (formData.height || 178) / 100;
  const bmi = ((formData.weight || 74.5) / (heightM * heightM)).toFixed(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      height: Number(formData.height),
      weight: Number(formData.weight)
    });
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Your support ticket has been dispatched to the FitNexus specialist team.');
    setIsSupportModalOpen(false);
    setSupportMessage('');
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Athlete Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage your athletic bio, anthropometric vitals, account credentials, and support options.
        </p>
      </div>

      {isSavedAlert && (
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
          <span>Profile changes saved successfully to your account!</span>
        </div>
      )}

      {/* Main 2-Column Grid: Left Profile Card + Right Personal Info Form */}
      <div className="profile-grid">
        {/* Left Column: Profile Card + Account Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Athlete Card */}
          <div className="profile-card">
            <div className="profile-avatar-wrap">
              <img src={user?.avatar} alt={user?.name} />
            </div>

            <span className="badge badge-teal" style={{ marginBottom: '8px' }}>
              <Sparkles size={12} /> {user?.membership || 'PRO Elite'}
            </span>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '2px' }}>
              {formData.name}
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {formData.email}
            </span>

            {/* Quick Metrics (Height, Weight, Age, BMI) */}
            <div className="profile-stats-row">
              <div className="profile-stat-col">
                <span>Height</span>
                <strong>{formData.height} cm</strong>
              </div>
              <div className="profile-stat-col">
                <span>Weight</span>
                <strong>{formData.weight} kg</strong>
              </div>
              <div className="profile-stat-col">
                <span>BMI</span>
                <strong style={{ color: 'var(--primary-teal)' }}>{bmi}</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
              "{formData.bio}"
            </p>

            <div style={{ width: '100%', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Member since: {user?.joinDate || 'January 2024'}
            </div>
          </div>

          {/* Quick Account Navigation */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
              Account Shortcuts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => navigate('/workouts/manage')}
              >
                <Sliders size={16} color="var(--primary-teal)" />
                <span>My Logged Workouts</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => navigate('/settings')}
              >
                <Bell size={16} color="var(--color-sky)" />
                <span>Workout & Meal Reminders</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => setIsSupportModalOpen(true)}
              >
                <HelpCircle size={16} color="var(--color-orange)" />
                <span>Contact Dedicated Support</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                style={{ color: '#F87171' }}
              >
                <LogOut size={16} />
                <span>Sign Out of FitNexus</span>
              </button>
            </div>
          </div>

          {/* Newsletter Subscription Card */}
          <div className="newsletter-card">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>FitNexus Digest</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Get cutting-edge hypertrophy science, low-carb athlete recipes, and workout programming tips weekly.
            </p>

            {newsletterSubscribed ? (
              <div style={{ color: '#34D399', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} /> Subscribed to weekly digest!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="athlete@domain.com"
                  required
                  className="form-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Editable Personal Information Form & Weight Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>
              Personal Information
            </h2>

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Non-Binary / Other</option>
                  </select>
                </div>

                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  min="100"
                  max="250"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <Input
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  required
                />

                <div className="form-group">
                  <label className="form-label">Calculated BMI Index</label>
                  <div
                    style={{
                      background: 'var(--bg-card-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 14px',
                      color: 'var(--primary-teal)',
                      fontWeight: 700
                    }}
                  >
                    {bmi} (Normal & Athletic Range)
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bio">Athlete Bio & Objectives</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Button variant="primary" type="submit" icon={Save}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Recent Weight Tracking Snapshot */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Weight Tracking History</h3>
              <button
                type="button"
                style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 600 }}
                onClick={() => navigate('/progress')}
              >
                View Full Analytics
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {progressHistory.slice(-4).reverse().map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    background: 'var(--bg-card-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar size={15} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{rec.date}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                    <span>Weight: <strong style={{ color: 'var(--primary-teal)' }}>{rec.weight} kg</strong></span>
                    {rec.bodyFat && <span>Body Fat: <strong style={{ color: 'var(--color-sky)' }}>{rec.bodyFat}%</strong></span>}
                    {rec.waist && <span>Waist: <strong>{rec.waist} cm</strong></span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support Modal */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        title="Contact FitNexus Support & Coaching"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsSupportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={MessageSquare} onClick={handleSupportSubmit}>
              Submit Ticket
            </Button>
          </>
        }
      >
        <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Need help with workout plans, nutrition logging, or account settings? Our certified strength coaches and technical engineers are here for you.
          </p>

          <Input
            label="Subject"
            placeholder="e.g. Question regarding Macro Algorithm or Workout Routine"
            defaultValue="General Inquiries & Feedback"
            required
          />

          <div className="form-group">
            <label className="form-label">Message Details</label>
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Describe your issue or coaching inquiry in detail..."
              required
              rows={4}
              className="form-textarea"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
