import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';

// Dónde empieza cada tipo de usuario
export const homeFor = (user) => user.roleId === 'manager' ? '/equipo' : '/app';

// Pantalla de ingreso de cada tipo de usuario (coincide con los ids de data/roles.js)
const loginFor = (role) => role === 'manager' ? '/ingresar/manager' : '/ingresar/empleado';

// Protege un espacio: solo pasa quien inició sesión con ese rol.
// - Sin sesión → va al ingreso.
// - Con otro rol → vuelve a su propio espacio.
export function RequireRole({ role }) {
  const { user } = useAppData();
  if (!user) return <Navigate to={loginFor(role)} replace />;
  if (user.roleId !== role) return <Navigate to={homeFor(user)} replace />;
  return <Outlet />;
}

// Pantallas para quien todavía no entró (inicio y elegir perfil).
// Si ya hay sesión, lleva directo al espacio.
export function PublicOnly() {
  const { user } = useAppData();
  if (user) return <Navigate to={homeFor(user)} replace />;
  return <Outlet />;
}
