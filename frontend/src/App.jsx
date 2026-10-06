import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from './contexts/AppDataContext';
import { AppShell } from './components/app/AppShell';
import { PublicOnly, RequireRole } from './components/RouteGuards';
import { Onboarding } from './pages/Onboarding';
import { RoleSelect } from './pages/RoleSelect';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { Welcome } from './pages/Welcome';
import { ComingSoon } from './pages/ComingSoon';
import { Dashboard } from './pages/employee/Dashboard';
import { TaskList } from './pages/employee/TaskList';
import { NewTask } from './pages/employee/NewTask';
import { TaskDetail } from './pages/employee/TaskDetail';
import { Recognitions } from './pages/employee/Recognitions';
import { Achievements } from './pages/employee/Achievements';
import { Profile } from './pages/employee/Profile';
import { EditEmail } from './pages/employee/EditEmail';
import { TeamDashboard } from './pages/manager/TeamDashboard';
import { TeamTasks } from './pages/manager/TeamTasks';
import { Projects } from './pages/manager/Projects';
import { Alerts } from './pages/manager/Alerts';
import { Reports } from './pages/manager/Reports';
import { Billing } from './pages/manager/Billing';
import { ManagerProfile } from './pages/manager/ManagerProfile';
import { Calendar } from './pages/employee/Calendar';
import { Lumi } from './pages/employee/Lumi';
import { TeamProvider } from './contexts/TeamContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './components/theme/dark.css';
import './components/brand.css';

export function App() {
  return (
    <ThemeProvider>
    <AppDataProvider>
      <TeamProvider>
      <BrowserRouter>
        <Routes>
          {/* Acceso */}
          <Route element={<PublicOnly />}>
            <Route path="/" element={<Onboarding />} />
            <Route path="/perfil" element={<RoleSelect />} />
          </Route>
          <Route path="/ingresar/:role" element={<Login />} />
          <Route path="/ingresar/:role/crear-cuenta" element={<SignUp />} />
          <Route path="/ingresar/:role/recuperar" element={<ForgotPassword />} />
          <Route path="/ingresar/:role/bienvenida" element={<Welcome />} />

          {/* Espacio del empleado */}
          <Route element={<RequireRole role="employee" />}>
            <Route path="/app" element={<AppShell variant="employee" />}>
              <Route index element={<Dashboard />} />
              <Route path="tareas" element={<TaskList />} />
              <Route path="tareas/nueva" element={<NewTask />} />
              <Route path="tareas/:taskId" element={<TaskDetail />} />
              <Route path="reconocimientos" element={<Recognitions />} />
              <Route path="logros" element={<Achievements />} />
              <Route path="perfil" element={<Profile />} />
              <Route path="perfil/email" element={<EditEmail />} />
              <Route path="calendario" element={<Calendar />} />
              <Route path="lumi" element={<Lumi />} />
            </Route>
          </Route>

          {/* Espacio del líder */}
          <Route element={<RequireRole role="manager" />}>
            <Route path="/equipo" element={<AppShell variant="manager" />}>
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
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </TeamProvider>
    </AppDataProvider>
    </ThemeProvider>);

}