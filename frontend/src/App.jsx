import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from './contexts/AppDataContext';
import { PublicOnly, RequireRole } from './components/RouteGuards';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageTitle } from './components/PageTitle';
import { RouteLoading } from './components/RouteLoading';
import { Onboarding } from './pages/Onboarding';
import { RoleSelect } from './pages/RoleSelect';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { Welcome } from './pages/Welcome';
import { TeamProvider } from './contexts/TeamContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './components/theme/dark.css';
import './components/brand.css';

// Cada espacio se descarga recién cuando alguien entra (ver src/routes/)
const EmployeeRoutes = lazy(() => import('./routes/EmployeeRoutes'));
const ManagerRoutes = lazy(() => import('./routes/ManagerRoutes'));

export function App() {
  return (
    <ThemeProvider>
      <AppDataProvider>
        <TeamProvider>
          <BrowserRouter>
            <PageTitle />
            <ErrorBoundary>
              <Suspense fallback={<RouteLoading />}>
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
                    <Route path="/app/*" element={<EmployeeRoutes />} />
                  </Route>

                  {/* Espacio del líder */}
                  <Route element={<RequireRole role="manager" />}>
                    <Route path="/equipo/*" element={<ManagerRoutes />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TeamProvider>
      </AppDataProvider>
    </ThemeProvider>);

}
