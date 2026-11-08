import React from 'react';

export const UserAvatar = ({
  src,
  alt = 'User avatar',
  size = 40,
  isOnline = true,
  className = ''
}) => {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-block'
      }}
    >
      <img
        src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--primary-teal)'
        }}
      />
      {isOnline && (
        <span
          style={{
            position: 'absolute',
            bottom: '1px',
            right: '1px',
            width: Math.max(8, Math.round(size * 0.25)),
            height: Math.max(8, Math.round(size * 0.25)),
            borderRadius: '50%',
            backgroundColor: '#10B981',
            border: '2px solid var(--bg-card)'
          }}
        />
      )}
    </div>
  );
};
