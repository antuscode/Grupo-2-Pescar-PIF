import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckIcon } from 'lucide-react';
import { Modal } from '../app/Modal';
import { Avatar } from '../app/Avatar';
import { Pill } from '../app/Pill';

// Sirve para dos cosas:
// - project = null  → crear un proyecto nuevo con su equipo
// - project = {...} → cambiar el equipo de un proyecto existente
export function ProjectModal({ open, project, members, existingNames, onClose, onSave }) {
  const isNew = !project;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState('');
  const [team, setTeam] = useState([]);
  const [errors, setErrors] = useState({});

  // Cada vez que se abre, carga los datos del proyecto (o vacíos si es nuevo)
  useEffect(() => {
    if (!open) return;
    setName('');
    setDescription('');
    setDue('');
    setTeam(project ? project.memberIds : []);
    setErrors({});
  }, [open, project?.id]);

  // Quien ya tiene tareas en el proyecto no se puede sacar del equipo
  const tasksIn = (member) => project ? member.tasks.filter((t) => t.project === project.name).length : 0;

  const toggle = (id) => setTeam(team.includes(id) ? team.filter((m) => m !== id) : [...team, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (isNew) {
      const clean = name.trim();
      if (!clean) next.name = 'Escribí el nombre del proyecto.';else
      if (existingNames.some((n) => n.toLowerCase() === clean.toLowerCase())) next.name = 'Ya existe un proyecto con ese nombre.';
    }
    if (members.length > 0 && team.length === 0) next.team = 'Elegí al menos una persona para el equipo.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({
      name: name.trim(),
      description: description.trim() || 'Sin descripción.',
      due: due ? format(new Date(`${due}T12:00`), 'dd MMM', { locale: es }) : 'Sin fecha',
      memberIds: team
    });
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="project-modal-title" wide>
      <h2 id="project-modal-title" className="modal-title">
        {isNew ? 'Nuevo proyecto' : `Equipo de ${project.name}`}
      </h2>
      <p className="modal-text">
        {isNew ?
        'Definí el proyecto y elegí quiénes van a trabajar en él.' :
        'Sumá o quitá integrantes. Solo ellos van a poder recibir tareas de este proyecto.'}
      </p>

      <form className="assign-form" onSubmit={handleSubmit} noValidate>
        {isNew &&
        <>
            <div>
              <label htmlFor="pj-name" className="field__label">Nombre del proyecto</label>
              <input
              id="pj-name"
              className={errors.name ? 'input input--sm input--error' : 'input input--sm'}
              placeholder="Ej. Portal de clientes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'pj-name-error' : undefined} />
            
              {errors.name && <p id="pj-name-error" className="field__error">{errors.name}</p>}
            </div>
            <div className="assign-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
              <div>
                <label htmlFor="pj-desc" className="field__label">Descripción</label>
                <input
                id="pj-desc"
                className="input input--sm"
                placeholder="Para qué es este proyecto"
                value={description}
                onChange={(e) => setDescription(e.target.value)} />
              
              </div>
              <div>
                <label htmlFor="pj-due" className="field__label">Fecha de entrega</label>
                <input id="pj-due" type="date" className="input input--sm" value={due} onChange={(e) => setDue(e.target.value)} />
              </div>
            </div>
          </>
        }

        <fieldset style={{ border: 0 }}>
          <legend className="field__label" style={{ marginBottom: 6 }}>
            Equipo del proyecto <span className="team-summary">· {team.length} seleccionados</span>
          </legend>
          <div className="assign-options">
            {members.map((m) => {
              const selected = team.includes(m.id);
              const locked = selected && tasksIn(m) > 0;
              let className = 'assign-option';
              if (selected) className += ' assign-option--selected';
              if (locked) className += ' assign-option--locked';
              return (
                <label key={m.id} className={className}>
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={locked}
                    onChange={() => toggle(m.id)} />
                  
                  <span className="member-check" aria-hidden="true">
                    {selected && <CheckIcon size={12} strokeWidth={3} />}
                  </span>
                  <Avatar initials={m.name.slice(0, 1)} color={`${m.color}40`} size="sm" />
                  <div className="assign-option__body">
                    <p className="assign-option__name">
                      {m.name} <span className="assign-option__meta">({m.role})</span>
                    </p>
                    <p className="assign-option__meta">
                      {locked ?
                      `Tiene ${tasksIn(m)} ${tasksIn(m) === 1 ? 'tarea' : 'tareas'} en este proyecto` :
                      `Carga actual: ${m.load}%`}
                    </p>
                  </div>
                  <Pill tone={m.status.tone} dot>{m.status.label}</Pill>
                </label>);

            })}
          </div>
          {members.length === 0 &&
          <p className="assign-option__meta">
              Todavía no agregaste integrantes. Podés crear el proyecto igual y sumar su equipo después, cuando cargues
              personas desde el Dashboard del equipo.
            </p>
          }
          {errors.team && <p className="field__error">{errors.team}</p>}
        </fieldset>

        <div className="modal__actions" style={{ marginTop: 4 }}>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--accent">
            {isNew ? 'Crear proyecto' : 'Guardar equipo'}
          </button>
        </div>
      </form>
    </Modal>);

}