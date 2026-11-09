import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'teal', // 'teal' | 'blue' | 'orange' | 'pink'
  label,
  showPercentage = false,
  height = 8,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / (max || 1)) * 100)));

  return (
    <div className={`progress-container ${className}`.trim()}>
      {(label || showPercentage) && (
        <div className="progress-header">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-semibold">{percentage}%</span>}
        </div>
      )}
      <div className="progress-track" style={{ height: `${height}px` }}>
        <div
          className={`progress-fill ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
