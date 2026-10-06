import React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// variant: 'onDark' (sobre fondos azul oscuro) | 'floating' (esquina de la pantalla)
export function ThemeToggle({ variant = 'onDark' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Activar modo día' : 'Activar modo noche';

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle--${variant}`}
      onClick={toggleTheme}
      aria-label={label}
      title={label}>
      
      {isDark ? <SunIcon size={16} aria-hidden="true" /> : <MoonIcon size={16} aria-hidden="true" />}
    </button>);

}