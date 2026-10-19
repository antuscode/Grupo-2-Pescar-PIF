import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toFrontRecognition, toFrontTask } from '../lib/adapters';
import { buildUser } from '../utils/user';
import { useAuth } from './AuthContext';

const AppDataContext = createContext(null);

const TASK_COLUMNS =
  'id,title,description,priority,status,hours,due_at,completed_at,project:projects(name),assignee:team_members(name)';
const RECOGNITION_COLUMNS = 'id,category,message,created_at,to:team_members!to_member_id(name)';

// Datos de la persona que inició sesión: perfil, tareas y reconocimientos enviados.
export function AppDataProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [recognitions, setRecognitions] = useState([]);
  const [myMemberId, setMyMemberId] = useState(null);
  const { session, profile, signOut: authSignOut } = useAuth();
  const userId = session?.user?.id;

  // Cambios locales del perfil (por ejemplo pendingEmail)
  const [overrides, setOverrides] = useState({});
  const user = useMemo(
    () => ({
      ...buildUser({ name: profile?.full_name, email: profile?.email, role: profile?.role }),
      ...overrides
    }),
    [profile, overrides]
  );

  // Al cambiar de persona: se vacía todo y, si es empleado, se cargan sus datos
  useEffect(() => {
    setTasks([]);
    setRecognitions([]);
    setOverrides({});
    setMyMemberId(null);
    if (!userId || profile?.role !== 'employee') return;

    let cancelled = false;
    (async () => {
      const { data: me, error: meError } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      if (cancelled) return;
      if (meError) console.error('Error al buscar tu perfil de equipo:', meError);
      if (!me) return;
      setMyMemberId(me.id);

      const [taskRes, recRes] = await Promise.all([
        supabase
          .from('tasks')
          .select(TASK_COLUMNS)
          .eq('assignee_member_id', me.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('recognitions')
          .select(RECOGNITION_COLUMNS)
          .eq('from_member_id', me.id)
          .order('created_at', { ascending: false })
      ]);
      if (cancelled) return;
      if (taskRes.error) console.error('Error al cargar tareas:', taskRes.error);
      else setTasks(taskRes.data.map(toFrontTask));
      if (recRes.error) console.error('Error al cargar reconocimientos:', recRes.error);
      else setRecognitions(recRes.data.map(toFrontRecognition));
    })();

    return () => { cancelled = true; };
  }, [userId, profile?.id, profile?.role]);

  const signOut = () => authSignOut();

  // Crea una tarea para vos o para alguien de tu equipo. Devuelve {} o { error }
  const addTask = async (task) => {
    if (!myMemberId) {
      return { error: 'No encontramos tu perfil de equipo. Pedile a tu líder que te cargue con tu correo.' };
    }

    // Responsable: si elegiste a otra persona, se busca por nombre dentro de tu equipo
    let assigneeId = myMemberId;
    if (task.assignee && task.assignee !== user.shortName) {
      const { data: other } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', profile.team_id)
        .eq('name', task.assignee)
        .maybeSingle();
      if (!other) return { error: `No encontramos a ${task.assignee} en tu equipo.` };
      assigneeId = other.id;
    }

    let projectId = null;
    if (task.project && task.project !== 'General') {
      const { data } = await supabase.from('projects').select('id').eq('name', task.project).maybeSingle();
      projectId = data?.id ?? null;
    }

    const row = {
      team_id: profile.team_id,
      assignee_member_id: assigneeId,
      project_id: projectId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      hours: task.hours || 0,
      due_at: task.dueAt
    };

    // Tarea para otra persona: no se puede leer de vuelta (solo ves las tuyas),
    // así que se guarda sin pedir el resultado y no aparece en tu lista
    if (assigneeId !== myMemberId) {
      const { error } = await supabase.from('tasks').insert(row);
      if (error) {
        console.error(error);
        return { error: error.message };
      }
      return {};
    }

    const { data, error } = await supabase.from('tasks').insert(row).select(TASK_COLUMNS).single();
    if (error) {
      console.error(error);
      return { error: error.message };
    }
    // Las subtareas siguen locales (no se guardan en la base)
    setTasks((prev) => [{ ...toFrontTask(data), subtasks: task.subtasks ?? [] }, ...prev]);
    return {};
  };

  // Cambia una tarea. Solo "completed" se guarda en la base; el resto queda local
  const updateTask = async (id, changes) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...changes } : t));
    if ('completed' in changes) {
      const { error } = await supabase
        .from('tasks')
        .update({ completed_at: changes.completed ? new Date().toISOString() : null })
        .eq('id', id);
      if (error) {
        console.error(error);
        // Si falla, se revierte el cambio en pantalla
        setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !changes.completed } : t));
      }
    }
  };

  // Envía un reconocimiento. Devuelve {} o { error }
  const addRecognition = async ({ person, category, message }) => {
    if (!myMemberId) return { error: 'No encontramos tu perfil de equipo.' };
    const { data: to } = await supabase.from('team_members').select('id').eq('name', person).maybeSingle();
    if (!to) return { error: `No encontramos a ${person} en tu equipo.` };
    const { data, error } = await supabase
      .from('recognitions')
      .insert({
        team_id: profile.team_id,
        from_member_id: myMemberId,
        to_member_id: to.id,
        category,
        message
      })
      .select(RECOGNITION_COLUMNS)
      .single();
    if (error) {
      console.error(error);
      return { error: error.message };
    }
    setRecognitions((prev) => [toFrontRecognition(data), ...prev]);
    return {};
  };

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
