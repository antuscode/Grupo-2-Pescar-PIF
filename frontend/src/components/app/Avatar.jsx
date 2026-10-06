import React from 'react';

// size: 'sm' | 'md' | 'lg'
export function Avatar({ initials, color, size = 'md' }) {
  const className = size === 'md' ? 'avatar' : `avatar avatar--${size}`;
  return (
    <span className={className} style={color ? { background: color } : undefined} aria-hidden="true">
      {initials}
    </span>);

}