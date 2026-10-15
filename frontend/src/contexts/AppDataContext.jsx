import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { buildUser } from '../utils/user';
import { useAuth } from './AuthContext';

const AppDataContext = createContext(null);

// Datos de la persona que inició sesión: su perfil, sus tareas y los reconocimientos que envió.
// El perfil sale de Supabase (AuthContext). Las tareas y los reconocimientos
// arrancan vacíos y se completan a medida que se usa la app.
export function AppDataProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [recognitions, setRecognitions] = useState([]);
  const { session, profile, signOut: authSignOut } = useAuth();

  // `overrides` guarda cambios locales (por ejemplo pendingEmail)
  // hasta que también los guardemos en la base.
  const [overrides, setOverrides] = useState({});
  const user = useMemo(
    () => ({
      ...buildUser({ name: profile?.full_name, email: profile?.email, role: profile?.role }),
      ...overrides
    }),
    [profile, overrides]
  );

  // Al cambiar de persona (login / logout) se limpian los datos en memoria
  useEffect(() => {
    setTasks([]);
    setRecognitions([]);
    setOverrides({});
  }, [profile?.id]);

  // Cierra la sesión en Supabase (los datos se limpian solos por el efecto de arriba)
  const signOut = () => authSignOut();

  const updateTask = (id, changes) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...changes } : t));
  };

  const addTask = (task) => setTasks((prev) => [task, ...prev]);

  const addRecognition = (recognition) => setRecognitions((prev) => [recognition, ...prev]);

  const updateUser = (changes) => setOverrides((prev) => ({ ...prev, ...changes }));

  const completedThisWeek = tasks.filter((t) => t.completed).length;

  const value = {
    tasks,
    updateTask,
    addTask,
    recognitions,
    addRecognition,
    user,
    isAuthenticated: Boolean(session),
    updateUser,
    signOut,
    completedThisWeek
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData debe usarse dentro de AppDataProvider');
  return context;
}
