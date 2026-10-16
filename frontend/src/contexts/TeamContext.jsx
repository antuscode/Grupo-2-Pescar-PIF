import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toFrontMember, toFrontProject, toLeaderTask } from '../lib/adapters';
import { useAuth } from './AuthContext';
import { ALERT_LOAD, memberColors, WEEKLY_HOURS } from '../data/team';
import { loadStatus } from '../utils/tasks';

const TeamContext = createContext(null);

const MEMBER_COLUMNS =
  'id,name,job_title,email,color,user_id,tasks:tasks!assignee_member_id(id,title,hours,due_at,completed_at,project:projects(id,name))';
const PROJECT_COLUMNS = 'id,name,description,due_date,project_members(member_id)';

// Traduce el error de la base a un texto entendible
const dbError = (error) => {
  console.error(error);
  if (error.code === '23505') return 'Ya existe uno con ese nombre.';
  if (error.code === '42501') return 'No tenés permiso para hacer esto.';
  return error.message;
};

// Guarda los integrantes y los proyectos del equipo (en Supabase).
// Las tareas siguen en memoria hasta la Fase C.
// Vive arriba de todas las pantallas para que los cambios se vean en todas.
export function TeamProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const { profile } = useAuth();
  const teamId = profile?.team_id ?? null;

  // Al cambiar de persona se vacía y se carga su equipo desde la base
  useEffect(() => {
    setMembers([]);
    setProjects([]);
    if (!teamId) return;

    let cancelled = false;
    (async () => {
      const [membersRes, projectsRes] = await Promise.all([
        supabase.from('team_members').select(MEMBER_COLUMNS).eq('team_id', teamId).order('created_at'),
        supabase.from('projects').select(PROJECT_COLUMNS).eq('team_id', teamId).order('created_at')
      ]);
      if (cancelled) return;
      if (membersRes.error) console.error('Error al cargar integrantes:', membersRes.error);
      else setMembers(membersRes.data.map(toFrontMember));
      if (projectsRes.error) console.error('Error al cargar proyectos:', projectsRes.error);
      else setProjects(projectsRes.data.map(toFrontProject));
    })();

    return () => { cancelled = true; };
  }, [profile?.id, teamId]);

  // Calcula horas, porcentaje de carga y alerta de cada integrante
  const withLoad = members.map((member) => {
    const hours = member.tasks.reduce((sum, t) => sum + t.hours, 0);
    const load = Math.round(hours / WEEKLY_HOURS * 100);
    const overloaded = load > ALERT_LOAD;
    // Se sugiere mover la tarea más grande
    const biggest = [...member.tasks].sort((a, b) => b.hours - a.hours)[0];
    return {
      ...member,
      hours,
      load,
      status: loadStatus(load),
      alert: overloaded ?
      `Tiene ${load}% de su capacidad asignada (${hours}h de ${WEEKLY_HOURS}h). Conviene revisar sus prioridades.` :
      null,
      suggestedTaskId: overloaded ? biggest?.id : null
    };
  });

  const alerts = withLoad.filter((m) => m.alert);
  const balanced = withLoad.length - alerts.length;

  const assignedHours = withLoad.reduce((sum, m) => sum + m.hours, 0);
  const totalHours = withLoad.length * WEEKLY_HOURS;
  const capacity = {
    assigned: assignedHours,
    total: totalHours,
    percent: totalHours ? Math.round(assignedHours / totalHours * 100) : 0
  };

  // Suma un integrante nuevo al equipo. Devuelve { member } o { error }
  const addMember = async ({ name, role, email }) => {
    if (!teamId) return { error: 'Tu cuenta no tiene un equipo asignado.' };
    const { data, error } = await supabase.
    from('team_members').
    insert({
      team_id: teamId,
      name,
      job_title: role,
      email: email || null,
      color: memberColors[members.length % memberColors.length]
    }).
    select(MEMBER_COLUMNS).
    single();
    if (error) return { error: dbError(error) };
    const member = toFrontMember(data);
    setMembers((prev) => [...prev, member]);
    return { member };
  };

  // Quita a un integrante del equipo y de todos los proyectos
  const removeMember = async (memberId) => {
    const { error } = await supabase.from('team_members').delete().eq('id', memberId);
    if (error) return { error: dbError(error) };
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setProjects((prev) => prev.map((p) => ({ ...p, memberIds: p.memberIds.filter((id) => id !== memberId) })));
    return {};
  };

  // Mueve una tarea de una persona a otra. Devuelve {} o { error }
  const reassign = async (fromId, taskId, toId) => {
    const { error } = await supabase.from('tasks').update({ assignee_member_id: toId }).eq('id', taskId);
    if (error) return { error: dbError(error) };
    setMembers((prev) => {
      const task = prev.find((m) => m.id === fromId).tasks.find((t) => t.id === taskId);
      return prev.map((m) => {
        if (m.id === fromId) return { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) };
        if (m.id === toId) return { ...m, tasks: [...m.tasks, task] };
        return m;
      });
    });
    return {};
  };

  // Agrega una tarea nueva a una persona. Devuelve {} o { error }
  const addTask = async (memberId, { title, description, project, hours, dueDate }) => {
    if (!teamId) return { error: 'Tu cuenta no tiene un equipo asignado.' };
    const projectId = projects.find((p) => p.name === project)?.id ?? null;
    const { data, error } = await supabase.
    from('tasks').
    insert({
      team_id: teamId,
      assignee_member_id: memberId,
      project_id: projectId,
      title,
      description: description?.trim() || undefined,
      hours: Number(hours) || 0,
      due_at: dueDate ? new Date(`${dueDate}T12:00`).toISOString() : null
    }).
    select('id,title,hours,due_at,project:projects(id,name)').
    single();
    if (error) return { error: dbError(error) };
    const task = toLeaderTask(data);
    setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, tasks: [...m.tasks, task] } : m));
    return {};
  };

  // Crea un proyecto nuevo con su equipo. Devuelve {} o { error }
  const addProject = async ({ name, description, dueDate, memberIds = [] }) => {
    if (!teamId) return { error: 'Tu cuenta no tiene un equipo asignado.' };
    const { data, error } = await supabase.
    from('projects').
    insert({ team_id: teamId, name, description, due_date: dueDate || null }).
    select('id,name,description,due_date').
    single();
    if (error) return { error: dbError(error) };

    if (memberIds.length) {
      const { error: linkError } = await supabase.
      from('project_members').
      insert(memberIds.map((member_id) => ({ project_id: data.id, member_id })));
      if (linkError) {
        // Si falla el equipo, se deshace el proyecto para no dejarlo a medias
        await supabase.from('projects').delete().eq('id', data.id);
        return { error: dbError(linkError) };
      }
    }

    const project = toFrontProject({
      ...data,
      project_members: memberIds.map((member_id) => ({ member_id }))
    });
    setProjects((prev) => [...prev, project]);
    return {};
  };

  // Cambia quiénes forman el equipo de un proyecto. Devuelve {} o { error }
  const updateProjectTeam = async (projectId, memberIds) => {
    const { error: deleteError } = await supabase.
    from('project_members').
    delete().
    eq('project_id', projectId);
    if (deleteError) return { error: dbError(deleteError) };

    if (memberIds.length) {
      const { error: insertError } = await supabase.
      from('project_members').
      insert(memberIds.map((member_id) => ({ project_id: projectId, member_id })));
      if (insertError) return { error: dbError(insertError) };
    }

    setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, memberIds } : p));
    return {};
  };

  const value = {
    members: withLoad,
    projects,
    alerts,
    balanced,
    capacity,
    addMember,
    removeMember,
    reassign,
    addTask,
    addProject,
    updateProjectTeam
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) throw new Error('useTeam debe usarse dentro de TeamProvider');
  return context;
}