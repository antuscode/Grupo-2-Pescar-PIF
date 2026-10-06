import React from 'react';
import { TopBar } from './TopBar';

export function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <TopBar />
      <div className="auth-layout">
        <aside className="brand">
          <span className="brand__lumi" role="img" aria-label="Lumi, el asistente de Lumora" />
          <p className="brand__tagline">Cuidamos la energía de tu equipo</p>
        </aside>
        {children}
      </div>
    </div>);

}