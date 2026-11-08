import React from 'react';

export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 56,
  strokeWidth = 5,
  color = '#16B8B0',
  showText = true,
  customText,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / (max || 1)) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`circular-progress-wrap ${className}`.trim()}
      style={{ width: size, height: size }}
    >
      <svg
        className="circular-progress-svg"
        width={size}
        height={size}
      >
        <circle
          className="circular-progress-bg"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="circular-progress-bar"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showText && (
        <span className="circular-progress-text" style={{ fontSize: size * 0.22 }}>
          {customText !== undefined ? customText : `${percentage}%`}
        </span>
      )}
    </div>
  );
};
