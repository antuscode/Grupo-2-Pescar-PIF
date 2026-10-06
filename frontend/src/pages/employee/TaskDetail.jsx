import { newId } from '../../utils/id';
import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { Avatar } from '../../components/app/Avatar';
import { Pill } from '../../components/app/Pill';
import { priorityTone, statusTone } from '../../utils/tasks';
import './tasks.css';

export function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTask, user } = useAppData();
  const task = tasks.find((t) => t.id === taskId);

  const [newSubtask, setNewSubtask] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [comment, setComment] = useState('');

  if (!task) return <Navigate to="/app/tareas" replace />;

  const doneCount = task.subtasks.filter((s) => s.done).length;

  const toggleSubtask = (id) => {
    updateTask(task.id, {
      subtasks: task.subtasks.map((s) => s.id === id ? { ...s, done: !s.done } : s)
    });
  };

  const addSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    updateTask(task.id, {
      subtasks: [...task.subtasks, { id: newId('s'), text: newSubtask.trim(), done: false }]
    });
    setNewSubtask('');
  };

  const sendComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    updateTask(task.id, {
      comments: [
      ...task.comments,
      {
        id: newId('c'),
        author: user.shortName,
        role: `${user.role} (Vos)`,
        time: 'Recién',
        text: comment.trim()
      }]

    });
    setComment('');
  };

  const markCompleted = () => {
    updateTask(task.id, { completed: true });
    navigate('/app/tareas', {
      state: { notice: { text: `Completaste "${task.title}".`, undoId: task.id } }
    });
  };

  return (
    <>
      <nav className="breadcrumb" aria-label="Ruta">
        <Link to="/app/tareas">Mis tareas</Link>
        <ChevronRightIcon size={12} aria-hidden="true" />
        <span className="breadcrumb__current">{task.title}</span>
      </nav>

      <header className="page-head">
        <div className="detail-title-row">
          <h1 className="page-title">{task.title}</h1>
          <Pill tone={priorityTone[task.priority]} dot>
            Prioridad {task.priority}
          </Pill>
        </div>
        {!task.completed &&
        <button type="button" className="btn btn--accent" onClick={markCompleted}>
            <CheckIcon size={16} aria-hidden="true" />
            Marcar como completada
          </button>
        }
      </header>

      <div className="detail-grid">
        <div className="detail-col">
          <section className="card" aria-labelledby="desc-title">
            <h2 id="desc-title" className="card__title" style={{ marginBottom: 12 }}>
              Descripción del entregable
            </h2>
            <p className="detail-text">{task.description}</p>
          </section>

          <section className="card" aria-labelledby="subtasks-title">
            <div className="card__head">
              <h2 id="subtasks-title" className="card__title">
                Lista de subtareas ({doneCount}/{task.subtasks.length} completadas)
              </h2>
              <button type="button" className="link-accent" onClick={() => setAddingSubtask(true)}>
                + Añadir subtarea
              </button>
            </div>
            {task.subtasks.length === 0 && !addingSubtask &&
            <p className="detail-text">Esta tarea todavía no tiene subtareas.</p>
            }
            <ul className="subtask-list">
              {task.subtasks.map((s) =>
              <li key={s.id}>
                  <label className={s.done ? 'subtask subtask--done' : 'subtask'}>
                    <input type="checkbox" checked={s.done} onChange={() => toggleSubtask(s.id)} />
                    <span>{s.text}</span>
                  </label>
                </li>
              )}
            </ul>
            {addingSubtask &&
            <form className="inline-add" onSubmit={addSubtask}>
                <input
                className="input input--sm"
                placeholder="Escribí la nueva subtarea"
                aria-label="Nueva subtarea"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                autoFocus />
              
                <button type="submit" className="btn btn--dark">
                  <PlusIcon size={14} aria-hidden="true" />
                  Añadir
                </button>
              </form>
            }
          </section>

          <section className="card" aria-labelledby="activity-title">
            <h2 id="activity-title" className="card__title" style={{ marginBottom: 16 }}>
              Actividad y comentarios
            </h2>
            {task.comments.length === 0 &&
            <p className="detail-text">Todavía no hay comentarios. Contá cómo viene esta tarea.</p>
            }
            {task.comments.map((c) =>
            <article key={c.id} className="comment">
                <Avatar initials={c.author.slice(0, 1)} color={c.author.startsWith('Diego') ? '#9EE0C4' : '#FFD970'} />
                <div className="comment__body">
                  <div className="comment__head">
                    <span className="comment__author">{c.author}</span>
                    <span className="comment__role">{c.role}</span>
                    <span className="comment__time">{c.time}</span>
                  </div>
                  <p className="comment__text">{c.text}</p>
                </div>
              </article>
            )}
            <form className="comment-box" onSubmit={sendComment}>
              <input
                placeholder="Escribí una actualización o consulta sobre esta tarea..."
                aria-label="Nuevo comentario"
                value={comment}
                onChange={(e) => setComment(e.target.value)} />
              
              <button type="submit" className="btn btn--accent btn--sm">
                Enviar
              </button>
            </form>
          </section>
        </div>

        <div className="detail-col">
          <section className="card" aria-labelledby="info-title">
            <h2 id="info-title" className="card__title" style={{ marginBottom: 16 }}>
              Detalles generales
            </h2>
            <dl className="info-list">
              <div className="info-row">
                <dt className="info-row__label">Estado</dt>
                <dd>
                  <Pill tone={statusTone[task.completed ? 'Completada' : task.status]}>
                    {task.completed ? 'Completada' : task.status}
                  </Pill>
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-row__label">Vencimiento</dt>
                <dd className={`info-row__value ${task.dueSoon ? 'due--soon' : ''}`}>{task.dueLabel}</dd>
              </div>
              <div className="info-row">
                <dt className="info-row__label">Responsable</dt>
                <dd className="info-row__value">
                  <Avatar initials={user.initials} size="sm" />
                  {task.assignee}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-row__label">Proyecto</dt>
                <dd className="info-row__value">{task.project}</dd>
              </div>
            </dl>
          </section>

          <button type="button" className="lumi-card" onClick={() => navigate('/app/lumi')}>
            <span className="lumi-dot" aria-hidden="true" />
            <span>
              <span className="lumi-card__title">Lumi · Asistente IA</span>
              <span className="lumi-card__text" style={{ display: 'block' }}>
                ¿Querés redactar un borrador del informe con datos actuales? Hacé clic para iniciar.
              </span>
            </span>
          </button>
        </div>
      </div>
    </>);

}