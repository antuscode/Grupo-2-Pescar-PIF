import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { titleFor } from '../data/pageTitles';

// Actualiza el título de la pestaña en cada cambio de pantalla. No dibuja nada.
export function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titleFor(pathname);
  }, [pathname]);

  return null;
}
