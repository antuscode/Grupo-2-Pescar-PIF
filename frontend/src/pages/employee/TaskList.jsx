import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckIcon, CircleCheckIcon, ListChecksIcon, MoreHorizontalIcon, PlusCircleIcon, SearchIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { EmptyState } from '../../components/app/EmptyState';
import { Pill } from '../../components/app/Pill';
import { LumiNudge } from '../../components/app/LumiNudge';
import { priorityTone, statusTone } from '../../utils/tasks';
import './tasks.css';

export function TaskList() {
  const { tasks, updateTask, completedThisWeek } = useAppData();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Todos');
  const [priority, setPriority] = useState('Todas');
  const [due, setDue] = useState('Todos');
  const [showCompleted, setShowCompleted] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [notice, setNotice] = useState(location.state?.notice ?? null);

  // Limpia el aviso que llegó desde otra pantalla para que no reaparezca
  useEffect(() => {
    if (location.state?.notice) navigate(location.pathname, { replace: true, state: null });
  }, []);

  const active = tasks.filter((t) => !t.completed);
  const stats = [
  { label: 'Activas', value: active.length },
  { label: 'Vencen pronto', value: active.filter((t) => t.dueSoon).length, urgent: true },
  { label: 'En progreso', value: active.filter((t) => t.status === 'En progreso').length },
  { label: 'Completadas', value: completedThisWeek }];


  const visible = (showCompleted ? tasks.filter((t) => t.completed) : active).filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (status !== 'Todos' && t.status !== status) return false;
    if (priority !== 'Todas' && t.priority !== priority) return false;
    if (due === 'Pronto' && !t.dueSoon) return false;
    if (due === 'Más adelante' && t.dueSoon) return false;
    return true;
  });

  const complete = (task, done) => {
    updateTask(task.id, { completed: done });
    setOpenMenu(null);
    setNotice(done ? { text: `Completaste "${task.title}".`, undoId: task.id } : null);
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Mis tareas</h1>
          <p className="page-subtitle">Organizá tu trabajo y mantené tus vencimientos bajo control</p>
        </div>
        <Link to="/app/tareas/nueva" className="btn btn--accent">
          <PlusCircleIcon size={16} aria-hidden="true" />
          Nueva tarea
        </Link>
      </header>

      {notice &&
      <div className="banner" role="status">
          <CircleCheckIcon size={16} aria-hidden="true" />
          <span className="banner__text">{notice.text}</span>
          {notice.undoId &&
        <button
          type="button"
          className="link-accent"
          onClick={() => {
            updateTask(notice.undoId, { completed: false });
            setNotice(null);
          }}>
          
              Deshacer
            </button>
        }
        </div>
      }

      <div className="task-stats">
        {stats.map((stat) =>
        <div key={stat.label} className={stat.urgent ? 'task-stat task-stat--urgent' : 'task-stat'}>
            <p className="task-stat__value">{stat.value}</p>
            <p className="task-stat__label">{stat.label}</p>
          </div>
        )}
      </div>

      <div className="task-filters">
        <label className="search">
          <SearchIcon size={14} aria-hidden="true" />
          <input
            className="input"
            type="search"
            placeholder="Buscar tareas..."
            aria-label="Buscar tareas"
            value={search}
            onChange={(e) => setSearch(e.target.value)} />
          
        </label>
        <select className="select" aria-label="Estado" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Todos">Estado: Todos</option>
          <option>En progreso</option>
          <option>Pendiente</option>
          <option>En revisión</option>
        </select>
        <select className="select" aria-label="Prioridad" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Todas">Prioridad: Todas</option>
          <option>Alta</option>
          <option>Media</option>
          <option>Baja</option>
        </select>
        <select className="select" aria-label="Vencimiento" value={due} onChange={(e) => setDue(e.target.value)}>
          <option value="Todos">Vencimiento: Todos</option>
          <option value="Pronto">Vencen pronto</option>
          <option value="Más adelante">Más adelante</option>
        </select>
      </div>

      <div className="task-table-wrap">
        <table className="task-table">
          <thead>
            <tr>
              <th className="task-table__check"><span className="sr-only">Completar</span></th>
              <th>Tarea</th>
              <th>Prioridad</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th className="task-table__actions"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((task) =>
            <tr key={task.id} className={task.completed ? 'task-row--done' : undefined}>
                <td>
                  <button
                  type="button"
                  className={task.completed ? 'round-check round-check--done' : 'round-check'}
                  aria-label={`Marcar "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
                  onClick={() => complete(task, !task.completed)}>
                  
                    {task.completed && <CheckIcon size={11} strokeWidth={3} aria-hidden="true" />}
                  </button>
                </td>
                <td>
                  <Link to={`/app/tareas/${task.id}`} className="task-row__title">
                    {task.title}
                  </Link>
                  <p className="task-row__project">{task.project}</p>
                </td>
                <td>
                  <Pill tone={priorityTone[task.priority]} dot>{task.priority}</Pill>
                </td>
                <td className={task.dueSoon && !task.completed ? 'due--soon' : undefined}>{task.dueLabel}</td>
                <td>
                  <Pill tone={statusTone[task.completed ? 'Completada' : task.status]}>
                    {task.completed ? 'Completada' : task.status}
                  </Pill>
                </td>
                <td className="task-table__actions">
                  <div className="row-menu">
                    <button
                    type="button"
                    className="row-menu__button"
                    aria-label={`Acciones de "${task.title}"`}
                    aria-expanded={openMenu === task.id}
                    onClick={() => setOpenMenu(openMenu === task.id ? null : task.id)}>
                    
                      <MoreHorizontalIcon size={18} aria-hidden="true" />
                    </button>
                    {openMenu === task.id &&
                  <div className="row-menu__list" role="menu">
                        <button type="button" role="menuitem" className="row-menu__item" onClick={() => navigate(`/app/tareas/${task.id}`)}>
                          Ver detalle
                        </button>
                        <button type="button" role="menuitem" className="row-menu__item" onClick={() => complete(task, !task.completed)}>
                          {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                        </button>
                      </div>
                  }
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {visible.length === 0 && (
        tasks.length === 0 ?
        <EmptyState
          compact
          icon={ListChecksIcon}
          title="Todavía no tenés tareas"
          text="Creá tu primera tarea para empezar a organizar tu semana.">
          
              <Link to="/app/tareas/nueva" className="btn btn--accent btn--sm">
                <PlusCircleIcon size={14} aria-hidden="true" />
                Crear tarea
              </Link>
            </EmptyState> :

        <p className="task-empty">
              {showCompleted ? 'Todavía no completaste tareas.' : 'No hay tareas que coincidan con tu búsqueda.'}
            </p>)
        }

        <div className="task-table__foot">
          <span>
            Mostrando {visible.length} de {showCompleted ? tasks.length - active.length : active.length}{' '}
            {showCompleted ? 'completadas' : 'tareas activas'}
          </span>
          <button type="button" className="link-accent" onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? '← Ver tareas activas' : 'Ver tareas completadas →'}
          </button>
        </div>
      </div>

      <LumiNudge>¿Necesitás ayuda para priorizar tu día? Preguntame.</LumiNudge>
    </>);

}