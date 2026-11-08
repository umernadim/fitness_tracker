import React, { useState, useMemo } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  CheckCircle,
  Dumbbell,
  Clock,
  Sparkles
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { NotificationItem } from '../components/common/NotificationItem';
import { Button } from '../components/common/Button';

export const Notifications = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useFitness();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'read'

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filterType === 'unread') return !n.read;
      if (filterType === 'read') return n.read;
      return true;
    });
  }, [notifications, filterType]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Athlete Notifications</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time reminders for scheduled workouts, daily hydration alerts, and milestone celebrations.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button variant="secondary" icon={CheckCheck} onClick={markAllAsRead}>
            Mark All as Read ({unreadNotificationsCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="tabs-container">
        <button
          type="button"
          className={`tab-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${filterType === 'unread' ? 'active' : ''}`}
          onClick={() => setFilterType('unread')}
        >
          Unread ({unreadNotificationsCount})
        </button>
        <button
          type="button"
          className={`tab-btn ${filterType === 'read' ? 'active' : ''}`}
          onClick={() => setFilterType('read')}
        >
          Archived Read ({notifications.length - unreadNotificationsCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '60px 20px',
            textAlign: 'center'
          }}
        >
          <Bell size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3>No notifications in this folder</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            You're all caught up with your training logs and scheduled activities!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      )}
    </div>
  );
};
