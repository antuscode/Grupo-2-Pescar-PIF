import { newId } from '../utils/id';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppData } from './AppDataContext';
import { ALERT_LOAD, memberColors, WEEKLY_HOURS } from '../data/team';
import { loadStatus } from '../utils/tasks';

const TeamContext = createContext(null);

// Guarda los integrantes, los proyectos y las tareas del equipo.
// Arranca vacío: el líder carga todo a mano.
// Vive arriba de todas las pantallas para que los cambios se vean en todas.
export function TeamProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const { user } = useAppData();

  // Al cerrar sesión se vacía el equipo, para que la próxima persona no vea datos ajenos
  useEffect(() => {
    if (!user) {
      setMembers([]);
      setProjects([]);
    }
  }, [user]);

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

  // Suma un integrante nuevo al equipo
  const addMember = ({ name, role, email }) => {
    const member = {
      id: newId('m'),
      name,
      role,
      email,
      color: memberColors[members.length % memberColors.length],
      tasks: []
    };
    setMembers((prev) => [...prev, member]);
    return member;
  };

  // Quita a un integrante del equipo y de todos los proyectos
  const removeMember = (memberId) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setProjects((prev) => prev.map((p) => ({ ...p, memberIds: p.memberIds.filter((id) => id !== memberId) })));
  };

  // Mueve una tarea de una persona a otra
  const reassign = (fromId, taskId, toId) => {
    setMembers((prev) => {
      const task = prev.find((m) => m.id === fromId).tasks.find((t) => t.id === taskId);
      return prev.map((m) => {
        if (m.id === fromId) return { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) };
        if (m.id === toId) return { ...m, tasks: [...m.tasks, task] };
        return m;
      });
    });
  };

  // Agrega una tarea nueva a una persona
  const addTask = (memberId, task) => {
    setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, tasks: [...m.tasks, task] } : m));
  };

  // Crea un proyecto nuevo con su equipo
  const addProject = (project) => {
    setProjects((prev) => [...prev, project]);
  };

  // Cambia quiénes forman el equipo de un proyecto
  const updateProjectTeam = (projectId, memberIds) => {
    setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, memberIds } : p));
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