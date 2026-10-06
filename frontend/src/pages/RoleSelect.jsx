import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { RoleCard } from '../components/RoleCard';
import { roles } from '../data/roles';

export function RoleSelect() {
  return (
    <AuthLayout>
      <main className="role-select">
        <h1 className="role-select__title">Bienvenido/a. ¿Cómo ingresarás hoy?</h1>
        <p className="role-select__subtitle">
          Elegí tu perfil para continuar con el acceso correspondiente.
        </p>
        <div className="role-grid">
          {roles.map((role) =>
          <RoleCard
            key={role.id}
            title={role.title}
            description={role.description}
            to={`/ingresar/${role.id}`} />

          )}
        </div>
      </main>
    </AuthLayout>);

}