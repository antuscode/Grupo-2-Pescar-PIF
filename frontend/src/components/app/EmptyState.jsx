import React from 'react';

// Mensaje para cuando una sección todavía no tiene datos.
// children: el botón para empezar (opcional)
export function EmptyState({ icon: Icon, title, text, children, compact = false }) {
  return (
    <div className={compact ? 'empty empty--compact' : 'empty'}>
      {Icon &&
      <div className="empty__icon">
          <Icon size={compact ? 20 : 24} aria-hidden="true" />
        </div>
      }
      <p className="empty__title">{title}</p>
      {text && <p className="empty__text">{text}</p>}
      {children}
    </div>);

}