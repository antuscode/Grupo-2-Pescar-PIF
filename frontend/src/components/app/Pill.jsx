import React from 'react';

// tone: 'red' | 'amber' | 'blue' | 'green' | 'purple' | 'neutral'
export function Pill({ tone = 'neutral', dot = false, children }) {
  const className = `pill pill--${tone}${dot ? ' pill--dot' : ''}`;
  return <span className={className}>{children}</span>;
}