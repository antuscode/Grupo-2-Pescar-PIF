import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckIcon, ChevronRightIcon, PlusIcon, XIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { useTeam } from '../../contexts/TeamContext';
import { LumiNudge } from '../../components/app/LumiNudge';
import { DEFAULT_PROJECT, suggestedSubtasks } from '../../data/tasks';
import { formatDue } from '../../utils/tasks';
import './tasks.css';

const PRIORITIES = ['Alta', 'Media', 'Baja'];

export function NewTask() {
  const navigate = useNavigate();
  const { addTask, user } = useAppData();
  const { projects: teamProjects, members } = useTeam();

  // Los proyectos los crea el líder; si todavía no hay, se usa "General"
  const projectOptions = [DEFAULT_PROJECT, ...teamProjects.map((p) => p.name)];
  const teammates = members.map((m) => m.name).filter((name) => name !== user.name);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState(projectOptions[0]);
  const [priority, setPriority] = useState('Media');
  const [hours, setHours] = useState('');
  const [due, setDue] = useState('');
  const [assignee, setAssignee] = useState(user.shortName);
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [errors, setErrors] = useState({});

  const addItem = () => {
    if (!newItem.trim()) return;
    setChecklist([...checklist, newItem.trim()]);
    setNewItem('');
  };

  const addSuggestions = () => {
    const missing = suggestedSubtasks.filter((s) => !checklist.includes(s));
    setChecklist([...checklist, ...missing]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!title.trim()) next.title = 'Escribí un nombre para la tarea.';
    if (hours !== '' && (Number(hours) <= 0 || Number(hours) > 40)) next.hours = 'Usá un valor entre 1 y 40 horas.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addTask({
      id: `tarea-${Date.now()}`,
      title: title.trim(),
      project,
      priority,
      hours: hours === '' ? 0 : Number(hours),
      ...formatDue(due),
      status: 'Pendiente',
      completed: false,
      assignee,
      description: description.trim() || 'Sin descripción por ahora.',
      subtasks: checklist.map((text, i) => ({ id: `s${i}`, text, done: false })),
      comments: []
    });
    navigate('/app/tareas', { state: { notice: { text: `Creaste "${title.trim()}".` } } });
  };

  return (
    <>
      <nav className="breadcrumb" aria-label="Ruta">
        <Link to="/app/tareas">Mis tareas</Link>
        <ChevronRightIcon size={12} aria-hidden="true" />
        <span className="breadcrumb__current">Nueva tarea</span>
      </nav>
      <h1 className="page-title" style={{ marginBottom: 24 }}>
        Crear nueva tarea
      </h1>

      <form className="card new-task" onSubmit={handleSubmit} noValidate>
        <div className="new-task__grid">
          <div className="new-task__col">
            <div>
              <label htmlFor="task-title" className="form-label">
                Nombre de la tarea *
              </label>
              <input
                id="task-title"
                className={errors.title ? 'input input--sm input--error' : 'input input--sm'}
                placeholder="Escribí un título claro y conciso para la tarea..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'task-title-error' : undefined} />
              
              {errors.title &&
              <p id="task-title-error" className="field__error">
                  {errors.title}
                </p>
              }
            </div>

            <div>
              <label htmlFor="task-desc" className="form-label">
                Descripción / notas
              </label>
              <textarea
                id="task-desc"
                className="textarea"
                placeholder="Añadí detalles del entregable, requerimientos clave o notas de seguimiento..."
                value={description}
                onChange={(e) => setDescription(e.target.value)} />
              
            </div>

            <div>
              <p className="form-label">Subtareas (checklist)</p>
              {checklist.length > 0 &&
              <ul className="checklist">
                  {checklist.map((item, i) =>
                <li key={item} className="checklist__item">
                      <span className="checklist__circle" aria-hidden="true" />
                      <span className="checklist__text">{item}</span>
                      <button
                    type="button"
                    className="checklist__remove"
                    aria-label={`Quitar "${item}"`}
                    onClick={() => setChecklist(checklist.filter((_, index) => index !== i))}>
                    
                        <XIcon size={14} aria-hidden="true" />
                      </button>
                    </li>
                )}
                </ul>
              }
              <div className="inline-add">
                <input
                  className="input input--sm"
                  placeholder="Añadir un elemento al checklist..."
                  aria-label="Nuevo elemento del checklist"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem();
                    }
                  }} />
                
                <button type="button" className="btn btn--ghost" onClick={addItem}>
                  <PlusIcon size={14} aria-hidden="true" />
                  Añadir
                </button>
              </div>
            </div>
          </div>

          <div className="new-task__col">
            <div>
              <label htmlFor="task-project" className="form-label">
                Proyecto o categoría *
              </label>
              <select id="task-project" className="select" value={project} onChange={(e) => setProject(e.target.value)}>
                {projectOptions.map((p) =>
                <option key={p}>{p}</option>
                )}
              </select>
            </div>

            <fieldset style={{ border: 0 }}>
              <legend className="form-label">Prioridad *</legend>
              <div className="segmented">
                {PRIORITIES.map((p) =>
                <button
                  key={p}
                  type="button"
                  aria-pressed={priority === p}
                  className={priority === p ? 'segmented__option segmented__option--active' : 'segmented__option'}
                  onClick={() => setPriority(p)}>
                  
                    {p}
                  </button>
                )}
              </div>
            </fieldset>

            <div>
              <label htmlFor="task-hours" className="form-label">
                Horas estimadas
              </label>
              <input
                id="task-hours"
                type="number"
                min="1"
                max="40"
                className={errors.hours ? 'input input--sm input--error' : 'input input--sm'}
                placeholder="Ej. 4"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                aria-invalid={Boolean(errors.hours)}
                aria-describedby={errors.hours ? 'task-hours-error' : undefined} />
              
              {errors.hours &&
              <p id="task-hours-error" className="field__error">
                  {errors.hours}
                </p>
              }
            </div>

            <div>
              <label htmlFor="task-due" className="form-label">
                Fecha de vencimiento
              </label>
              <input
                id="task-due"
                type="datetime-local"
                className="input input--sm"
                value={due}
                onChange={(e) => setDue(e.target.value)} />
              
            </div>

            <div>
              <label htmlFor="task-assignee" className="form-label">
                Asignar a
              </label>
              <select id="task-assignee" className="select" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                <option value={user.shortName}>{user.shortName} (Vos)</option>
                {teammates.map((name) =>
                <option key={name}>{name}</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="new-task__footer">
          <Link to="/app/tareas" className="btn btn--ghost">
            Cancelar
          </Link>
          <button type="submit" className="btn btn--accent">
            <CheckIcon size={16} aria-hidden="true" />
            Crear tarea
          </button>
        </div>
      </form>

      <LumiNudge onClick={addSuggestions}>
        ¿Querés que agregue subtareas sugeridas para esta tarea?
      </LumiNudge>
    </>);

}