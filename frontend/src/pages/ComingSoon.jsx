import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HourglassIcon } from 'lucide-react';
import { comingSoonTitles } from '../data/navigation';

export function ComingSoon() {
  const { pathname } = useLocation();
  const slug = pathname.split('/').pop();
  const title = comingSoonTitles[slug] ?? 'Esta sección';
  const home = pathname.startsWith('/equipo') ? '/equipo' : '/app';

  return (
    <section className="empty" aria-labelledby="soon-title">
      <div className="empty__icon">
        <HourglassIcon size={24} aria-hidden="true" />
      </div>
      <h1 id="soon-title" className="empty__title">
        {title} llega pronto
      </h1>
      <p className="empty__text">
        Estamos preparando esta sección. Mientras tanto, podés seguir desde tu inicio.
      </p>
      <Link to={home} className="btn btn--dark">
        Volver al inicio
      </Link>
    </section>);

}