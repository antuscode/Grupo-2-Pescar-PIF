import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleCheckIcon, FolderKanbanIcon, PlusIcon, UsersIcon } from 'lucide-react';
import { useTeam } from '../../contexts/TeamContext';
import { EmptyState } from '../../components/app/EmptyState';
import { Avatar } from '../../components/app/Avatar';
import { ProjectModal } from '../../components/manager/ProjectModal';
import { teamInfo } from '../../data/team';
import './board.css';
import './projects.css';

export function Projects() {
  const { members, projects, addProject, updateProjectTeam } = useTeam();
  const [modal, setModal] = useState(null); // null | 'new' | id del proyecto
  const [notice, setNotice] = useState('');

  const editing = projects.find((p) => p.id === modal) ?? null;

  const handleSave = (data) => {
    if (modal === 'new') {
      addProject({ id: `pj${Date.now()}`, ...data });
      setNotice(
        data.memberIds.length ?
        `Creaste “${data.name}” con un equipo de ${data.memberIds.length} ${data.memberIds.length === 1 ? 'persona' : 'personas'}.` :
        `Creaste “${data.name}”. Asignale un equipo cuando sumes integrantes.`
      );
    } else {
      updateProjectTeam(editing.id, data.memberIds);
      setNotice(`Actualizaste el equipo de “${editing.name}”.`);
    }
    setModal(null);
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Proyectos</h1>
          <p className="page-subtitle">
            {teamInfo.name} · {projects.length} {projects.length === 1 ? 'proyecto activo' : 'proyectos activos'}
          </p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn--accent" onClick={() => setModal('new')}>
            <PlusIcon size={16} aria-hidden="true" />
            Nuevo proyecto
          </button>
        </div>
      </header>

      {notice &&
      <div className="banner" role="status">
          <CircleCheckIcon size={16} aria-hidden="true" />
          <span className="banner__text">{notice}</span>
        </div>
      }

      <section className="project-list" aria-label="Proyectos">
        {projects.map((p) => {
          const team = members.filter((m) => p.memberIds.includes(m.id));
          const tasks = members.flatMap((m) => m.tasks).filter((t) => t.project === p.name);
          const hours = tasks.reduce((sum, t) => sum + t.hours, 0);
          return (
            <article key={p.id} className="project-row">
              <div>
                <h2 className="project-row__name">{p.name}</h2>
                <p className="project-row__desc">{p.description}</p>
                <p className="project-row__meta">Entrega: {p.due}</p>
              </div>

              <div>
                <p className="project-row__label">Equipo</p>
                {team.length > 0 ?
                <div className="avatar-stack">
                    {team.map((m) =>
                  <Avatar key={m.id} initials={m.name.slice(0, 1)} color={`${m.color}40`} size="sm" />
                  )}
                    <span className="avatar-stack__names">{team.map((m) => m.name.split(' ')[0]).join(', ')}</span>
                  </div> :

                <p className="project-row__empty-team">Sin equipo asignado</p>
                }
              </div>

              <div>
                <p className="project-row__label">Tareas activas</p>
                <p className="project-row__hours">
                  {tasks.length}
                  <small>{hours}h estimadas</small>
                </p>
              </div>

              <div className="page-actions">
                <Link to="/equipo/tareas" className="btn btn--ghost btn--sm">
                  Ver tareas
                </Link>
                <button type="button" className="btn btn--dark btn--sm" onClick={() => setModal(p.id)}>
                  <UsersIcon size={14} aria-hidden="true" />
                  Asignar equipo
                </button>
              </div>
            </article>);

        })}
        {projects.length === 0 &&
        <div className="card">
            <EmptyState
            compact
            icon={FolderKanbanIcon}
            title="Todavía no hay proyectos"
            text="Creá tu primer proyecto y elegí qué integrantes van a trabajar en él.">
            
              <button type="button" className="btn btn--accent btn--sm" onClick={() => setModal('new')}>
                <PlusIcon size={14} aria-hidden="true" />
                Crear proyecto
              </button>
            </EmptyState>
          </div>
        }
      </section>

      <ProjectModal
        open={modal !== null}
        project={editing}
        members={members}
        existingNames={projects.map((p) => p.name)}
        onClose={() => setModal(null)}
        onSave={handleSave} />
      
    </>);

}