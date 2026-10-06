import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon, CircleCheckIcon } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { roles } from '../data/roles';
import { useAppData } from '../contexts/AppDataContext';

export function Welcome() {
  const { role: roleId } = useParams();
  const role = roles.find((r) => r.id === roleId);
  const reduceMotion = useReducedMotion();
  const { user } = useAppData();

  if (!role) return <Navigate to="/" replace />;
  if (!user) return <Navigate to={`/ingresar/${role.id}`} replace />;

  return (
    <AuthLayout>
      <main className="auth-main">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          aria-labelledby="welcome-title"
          className="welcome-card">
          
          <div className="welcome-card__icon">
            <CircleCheckIcon size={20} aria-hidden="true" />
          </div>
          <span className="badge">Acceso exitoso</span>
          <h1 id="welcome-title" className="welcome-card__title">
            ¡Te damos la bienvenida!
          </h1>
          <p className="welcome-card__text">
            Ingresaste correctamente a tu espacio de Lumora. Todo está listo para
            continuar.
          </p>
          <div className="welcome-card__action">
            <Link to={role.id === 'manager' ? '/equipo' : '/app'} className="btn-primary">
              Continuar a mi espacio
              <ArrowRightIcon size={16} aria-hidden="true" />
            </Link>
          </div>
        </motion.section>
      </main>
    </AuthLayout>);

}