import React from 'react';
import { Dumbbell, Trophy, Droplet, Flame, Utensils, Target, Calendar, Check, Trash2 } from 'lucide-react';

const iconMap = {
  Dumbbell,
  Trophy,
  Droplet,
  Flame,
  Utensils,
  Target,
  Calendar
};

export const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete
}) => {
  const IconComponent = iconMap[notification.icon] || Dumbbell;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        background: notification.read ? 'var(--bg-card)' : 'rgba(22, 184, 176, 0.08)',
        border: `1px solid ${notification.read ? 'var(--border-color)' : 'rgba(22, 184, 176, 0.3)'}`,
        transition: 'all var(--transition-fast)'
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-sm)',
          background: notification.read ? 'var(--bg-card-secondary)' : 'rgba(22, 184, 176, 0.2)',
          color: notification.read ? 'var(--text-secondary)' : 'var(--primary-teal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <IconComponent size={18} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: notification.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
            {notification.title}
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {notification.timestamp}
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {notification.message}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {!notification.read && onMarkRead && (
          <button
            type="button"
            title="Mark as read"
            onClick={() => onMarkRead(notification.id)}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--primary-teal)',
              background: 'rgba(22, 184, 176, 0.1)'
            }}
          >
            <Check size={16} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            title="Delete notification"
            onClick={() => onDelete(notification.id)}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)'
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
