import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  className = ''
}) => {
  return (
    <div className={`search-bar-box ${className}`.trim()}>
      <Search size={18} color="var(--text-muted)" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
