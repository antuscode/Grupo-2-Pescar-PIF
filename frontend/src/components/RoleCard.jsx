import React from 'react';
import { Link } from 'react-router-dom';

export function RoleCard({ title, description, to }) {
  return (
    <Link to={to} className="role-card">
      <h2 className="role-card__title">{title}</h2>
      <p className="role-card__text">{description}</p>
    </Link>);

}