import React from 'react';
import { useLocation } from 'react-router-dom';

// Atrapa los errores de cualquier pantalla para no dejar la página en blanco.
// También cubre el caso en que no se pueda descargar una pantalla (sin conexión, o la app se actualizó).
class Boundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Error en la pantalla:', error, info.componentStack);
  }

  // Si la persona navega a otra pantalla, se vuelve a intentar
  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="error-screen" role="alert">
        <h1 className="error-screen__title">Algo salió mal</h1>
        <p className="error-screen__text">
          Ocurrió un error inesperado. Probá recargar la página; si sigue pasando, volvé al inicio.
        </p>
        <div className="error-screen__actions">
          <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
            Recargar
          </button>
          <a href="/" className="btn-secondary">Ir al inicio</a>
        </div>
      </main>);

  }
}

export function ErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return <Boundary resetKey={pathname}>{children}</Boundary>;
}
