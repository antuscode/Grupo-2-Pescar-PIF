import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

export function BackLink({ to, children }) {
  return (
    <Link to={to} className="back-link">
      <ArrowLeftIcon size={14} aria-hidden="true" />
      {children}
    </Link>);

}