import React from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon } from 'lucide-react';
import { LumoraLogo } from './LumoraLogo';
import { ThemeToggle } from './theme/ThemeToggle';

// Barra superior con el logo de Lumora. Es la misma en todas las pantallas.
// - logoTo: a dónde lleva el logo
// - showTagline: muestra el lema al lado del logo
// - onMenu: si se pasa, muestra el botón de menú (solo en celular)
// - children: botones extra a la derecha
export function TopBar({ logoTo = '/', showTagline = false, onMenu, menuOpen = false, children }) {
  return (
    <header className="topbar">
      {onMenu &&
      <button
        type="button"
        className="topbar__menu"
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
        onClick={onMenu}>
        
          <MenuIcon size={20} aria-hidden="true" />
        </button>
      }
      <Link to={logoTo} className="topbar__brand" aria-label="Lumora, ir al inicio">
        <LumoraLogo className="topbar__logo" />
      </Link>
      {showTagline && <span className="topbar__tagline">Cuidamos la energía de tu equipo</span>}
      <div className="topbar__actions">
        <ThemeToggle />
        {children}
      </div>
    </header>);

}