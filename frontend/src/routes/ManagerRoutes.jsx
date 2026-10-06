import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/app/AppShell';
import { ComingSoon } from '../pages/ComingSoon';
import { Lumi } from '../pages/employee/Lumi';
import { TeamDashboard } from '../pages/manager/TeamDashboard';
import { TeamTasks } from '../pages/manager/TeamTasks';
import { Projects } from '../pages/manager/Projects';
import { Alerts } from '../pages/manager/Alerts';
import { Reports } from '../pages/manager/Reports';
import { Billing } from '../pages/manager/Billing';
import { ManagerProfile } from '../pages/manager/ManagerProfile';

// Espacio del líder (/equipo/*). Se descarga solo cuando alguien entra acá.
export default function ManagerRoutes() {
  return (
    <Routes>
      <Route element={<AppShell variant="manager" />}>
        <Route index element={<TeamDashboard />} />
        <Route path="proyectos" element={<Projects />} />
        <Route path="lumi" element={<Lumi variant="manager" />} />
        <Route path="tareas" element={<TeamTasks />} />
        <Route path="alertas" element={<Alerts />} />
        <Route path="reportes" element={<Reports />} />
        <Route path="perfil" element={<ManagerProfile />} />
        <Route path="perfil/suscripcion" element={<Billing />} />
        <Route path="suscripcion" element={<Navigate to="/equipo/perfil/suscripcion" replace />} />
        <Route path=":section" element={<ComingSoon />} />
        <Route path="*" element={<Navigate to="/equipo" replace />} />
      </Route>
    </Routes>);

}
