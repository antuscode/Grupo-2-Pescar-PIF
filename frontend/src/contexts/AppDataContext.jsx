import React, { createContext, useContext, useEffect, useState } from 'react';
import { buildUser } from '../utils/user';
import { clearSession, loadSession, saveSession } from '../utils/session';

const AppDataContext = createContext(null);

// Datos de la persona que inició sesión: su perfil, sus tareas y los reconocimientos que envió.
// La sesión (user) se guarda en el navegador para sobrevivir a una recarga.
// Las tareas y los reconocimientos arrancan vacíos y se completan a medida que se usa la app.
export function AppDataProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [recognitions, setRecognitions] = useState([]);
  // null = nadie inició sesión
  const [user, setUser] = useState(() => loadSession());

  useEffect(() => {
    if (user) saveSession(user);else
    clearSession();
  }, [user]);

  // Se llama al iniciar sesión o crear una cuenta
  const signIn = (data) => setUser(buildUser(data));

  // Cierra la sesión y borra los datos de la persona
  const signOut = () => {
    setUser(null);
    setTasks([]);
    setRecognitions([]);
  };

  const updateTask = (id, changes) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...changes } : t));
  };

  const addTask = (task) => setTasks((prev) => [task, ...prev]);

  const addRecognition = (recognition) => setRecognitions((prev) => [recognition, ...prev]);

  const updateUser = (changes) => setUser((prev) => ({ ...prev, ...changes }));

  const completedThisWeek = tasks.filter((t) => t.completed).length;

  const value = {
    tasks,
    updateTask,
    addTask,
    recognitions,
    addRecognition,
    user,
    isAuthenticated: Boolean(user),
    updateUser,
    signIn,
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
