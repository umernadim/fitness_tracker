import React from 'react';

export const ChartCard = ({
  title,
  icon: Icon,
  subtitle,
  action,
  children,
  className = ''
}) => {
  return (
    <div className={`chart-card ${className}`.trim()}>
      <div className="chart-card-header">
        <div>
          <h3 className="chart-card-title">
            {Icon && <Icon size={18} className="text-teal" />}
            {title}
          </h3>
          {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div style={{ flex: 1, minHeight: '260px', width: '100%', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
};
