import React from 'react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span className="text-teal">*</span>}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            <Icon size={18} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="form-input"
          style={Icon ? { paddingLeft: '40px' } : {}}
          {...props}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
      {helperText && !error && <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{helperText}</span>}
    </div>
  );
};
