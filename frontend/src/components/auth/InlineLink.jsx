import React from 'react';
import { Link } from 'react-router-dom';

export function InlineLink({ to, children }) {
  return (
    <Link to={to} className="text-link">
      {children}
    </Link>);

}