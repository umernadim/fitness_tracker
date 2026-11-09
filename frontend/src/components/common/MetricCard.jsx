import React from 'react';
import { ProgressBar } from './ProgressBar';
import { CircularProgress } from './CircularProgress';

export const MetricCard = ({
  title,
  value,
  target,
  unit = '',
  icon: Icon,
  colorScheme = 'teal', // 'teal' | 'blue' | 'orange' | 'pink'
  trend,
  trendType = 'positive', // 'positive' | 'neutral'
  progressValue,
  progressMax,
  type = 'bar', // 'bar' | 'circle' | 'chart' | 'custom'
  chartComponent,
  actionButton,
  className = ''
}) => {
  const gradientClass = `gradient-${colorScheme}`;

  return (
    <div className={`metric-card ${gradientClass} ${className}`.trim()}>
      <div>
        <div className="metric-card-header">
          <div className={`metric-icon-box ${colorScheme}`}>
            {Icon && <Icon size={22} />}
          </div>
          {trend && (
            <span className={`metric-trend-pill ${trendType}`}>
              {trend}
            </span>
          )}
        </div>

        <div className="metric-title">{title}</div>
        <div className="metric-value-row">
          <span className="metric-value">
            {value}
            {unit && <span style={{ fontSize: '0.9rem', marginLeft: '4px', fontWeight: 500, color: 'var(--text-secondary)' }}>{unit}</span>}
          </span>
          {target && <span className="metric-target">/ {target}</span>}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        {type === 'bar' && progressValue !== undefined && (
          <ProgressBar
            value={progressValue}
            max={progressMax || 100}
            color={colorScheme}
            showPercentage
          />
        )}

        {type === 'circle' && progressValue !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Goal Progress
            </span>
            <CircularProgress
              value={progressValue}
              max={progressMax || 100}
              size={48}
              strokeWidth={4.5}
              color={
                colorScheme === 'teal' ? '#16B8B0' :
                colorScheme === 'blue' ? '#38BDF8' :
                colorScheme === 'orange' ? '#FB923C' : '#F472B6'
              }
            />
          </div>
        )}

        {type === 'chart' && chartComponent}

        {actionButton && <div style={{ marginTop: '12px' }}>{actionButton}</div>}
      </div>
    </div>
  );
};
