import React from 'react';
import { Loader2Icon } from 'lucide-react';

// Se muestra mientras se descarga el espacio al que entra la persona
export function RouteLoading() {
  return (
    <div className="route-loading" role="status">
      <Loader2Icon size={24} className="spinner" aria-hidden="true" />
      <span className="sr-only">Cargando…</span>
    </div>);

}
