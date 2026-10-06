import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanbanIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { useTeam } from '../../contexts/TeamContext';
import { EmptyState } from '../../components/app/EmptyState';
import { Avatar } from '../../components/app/Avatar';
import { Pill } from '../../components/app/Pill';
import { NewTeamTaskModal } from '../../components/manager/NewTeamTaskModal';
import { SAFE_LOAD, teamInfo } from '../../data/team';
import '../employee/tasks.css';
import './board.css';

export function TeamTasks() {
  const { members, projects, capacity, addTask } = useTeam();
  const teamProjects = projects.map((p) => p.name);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [project, setProject] = useState('Todos');
  const [person, setPerson] = useState('Todos');
  const [modalOpen, setModalOpen] = useState(false);

  // Junta las tareas de todos con los datos de quién las tiene
  const allTasks = members.flatMap((m) => m.tasks.map((t) => ({ ...t, member: m })));
  const visible = allTasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (person !== 'Todos' && t.member.id !== person) return false;
    return true;
  });
  const columns = project === 'Todos' ? teamProjects : [project];
  const capacityHigh = capacity.percent > SAFE_LOAD;

  const handleSave = (member, task) => {
    addTask(member.id, task);
    setModalOpen(false);
    navigate('/equipo', {
      state: {
        toast: {
          title: `¡Tarea asignada con éxito a ${member.name}!`,
          text: 'Se envió una notificación al colaborador y se actualizó su indicador de carga.'
        }
      }
    });
  };

  return (
    <>
      <header className="page-head" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Tareas · {teamInfo.name}</h1>
          <p className="page-subtitle">
            {teamProjects.length} {teamProjects.length === 1 ? 'proyecto' : 'proyectos'} · {allTasks.length}{' '}
            {allTasks.length === 1 ? 'tarea activa' : 'tareas activas'}
          </p>
        </div>
      </header>

      <div className="board-toolbar">
        <label className="search">
          <SearchIcon size={14} aria-hidden="true" />
          <input
            className="input"
            type="search"
            placeholder="Buscar tarea..."
            aria-label="Buscar tarea"
            value={search}
            onChange={(e) => setSearch(e.target.value)} />
          
        </label>
        <select className="select" aria-label="Proyecto" value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="Todos">Proyecto: Todos</option>
          {teamProjects.map((p) =>
          <option key={p}>{p}</option>
          )}
        </select>
        <select className="select" aria-label="Colaborador" value={person} onChange={(e) => setPerson(e.target.value)}>
          <option value="Todos">Colaborador: Todos</option>
          {members.map((m) =>
          <option key={m.id} value={m.id}>
              {m.name}
            </option>
          )}
        </select>
        <button
          type="button"
          className="btn btn--accent"
          onClick={() => setModalOpen(true)}
          disabled={teamProjects.length === 0}
          title={teamProjects.length === 0 ? 'Creá un proyecto primero' : undefined}>
          
          <PlusIcon size={16} aria-hidden="true" />
          Nueva tarea
        </button>
      </div>

      <section className="capacity" aria-label="Capacidad general del equipo">
        <div>
          <p className="capacity__label">Capacidad general del equipo</p>
          <p className="capacity__value">
            {capacity.percent}%
            <span className="capacity__hours">
              {capacity.assigned}h / {capacity.total}h
            </span>
          </p>
        </div>
        <div className="capacity__track" aria-hidden="true">
          <div
            className={capacityHigh ? 'capacity__fill capacity__fill--high' : 'capacity__fill'}
            style={{ width: `${Math.min(capacity.percent, 100)}%` }} />
          
        </div>
        <Pill tone={capacityHigh ? 'amber' : 'green'} dot>
          {capacityHigh ? 'Exigida' : 'Saludable'}
        </Pill>
      </section>

      {teamProjects.length === 0 &&
      <div className="card">
          <EmptyState
          compact
          icon={FolderKanbanIcon}
          title="Todavía no hay proyectos"
          text={
          members.length ?
          'Las tareas se organizan por proyecto. Creá uno y asignale su equipo para empezar.' :
          'Primero agregá integrantes desde el Dashboard del equipo y después creá un proyecto.'
          }>
          
            <Link to={members.length ? '/equipo/proyectos' : '/equipo'} className="btn btn--accent btn--sm">
              {members.length ? 'Crear proyecto' : 'Agregar integrantes'}
            </Link>
          </EmptyState>
        </div>
      }

      <div className="board">
        {columns.map((col) => {
          const tasks = visible.filter((t) => t.project === col);
          return (
            <section key={col} className="board-column" aria-labelledby={`col-${col}`}>
              <h2 id={`col-${col}`} className="board-column__head">
                {col}
                <span className="board-column__count">{tasks.length}</span>
              </h2>
              <div className="board-column__list">
                {tasks.map((t) =>
                <article key={t.id} className="board-card">
                    <p className="board-card__title">{t.title}</p>
                    <div className="board-card__foot">
                      <span className="board-card__person">
                        <Avatar initials={t.member.name.slice(0, 1)} color={`${t.member.color}40`} size="sm" />
                        {t.member.name}
                      </span>
                      <span className="board-card__meta">
                        {t.hours}h · {t.due}
                      </span>
                    </div>
                  </article>
                )}
                {tasks.length === 0 && <p className="board-column__empty">Sin tareas para este filtro.</p>}
              </div>
            </section>);

        })}
      </div>

      <NewTeamTaskModal open={modalOpen} members={members} projects={projects} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </>);

}