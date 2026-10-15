import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Dónde empieza cada tipo de usuario
export const homeFor = (user) => user.roleId === 'manager' ? '/equipo' : '/app';

// Pantalla de ingreso de cada tipo de usuario
const loginFor = (role) => role === 'manager' ? '/ingresar/manager' : '/ingresar/empleado';

function Cargando() {
  return <div role="status" style={{ padding: 48, textAlign: 'center' }}>Cargando…</div>;
}

// Protege un espacio: solo pasa quien inició sesión con ese rol.
export function RequireRole({ role }) {
  const { session, profile, loading } = useAuth();
  if (loading) return <Cargando />;
  if (!session) return <Navigate to={loginFor(role)} replace />;
  if (profile && profile.role !== role) {
    return <Navigate to={homeFor({ roleId: profile.role })} replace />;
  }
  return <Outlet />;
}

// Pantallas para quien todavía no entró (inicio y elegir perfil).
export function PublicOnly() {
  const { session, profile, loading } = useAuth();
  if (loading) return <Cargando />;
  if (session && profile) return <Navigate to={homeFor({ roleId: profile.role })} replace />;
  return <Outlet />;
}