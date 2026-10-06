import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Modal } from '../app/Modal';
import { Avatar } from '../app/Avatar';
import { Pill } from '../app/Pill';
import { SAFE_LOAD, WEEKLY_HOURS } from '../../data/team';

const EMPTY = { title: '', description: '', project: '', hours: '', due: '', memberId: '' };

export function NewTeamTaskModal({ open, members, projects, onClose, onSave }) {
  const fresh = () => ({ ...EMPTY, project: projects[0]?.name ?? '' });
  const [form, setForm] = useState(fresh);
  const [errors, setErrors] = useState({});

  // Cada vez que se abre, arranca vacía y con el primer proyecto elegido
  useEffect(() => {
    if (!open) return;
    setForm(fresh());
    setErrors({});
  }, [open]);

  const set = (field, value) => setForm({ ...form, [field]: value });
  const hours = Number(form.hours) || 0;
  const projected = (member) => Math.round((member.hours + hours) / WEEKLY_HOURS * 100);

  // Solo se puede asignar a quienes forman el equipo del proyecto.
  // Las personas con más margen aparecen primero.
  const project = projects.find((p) => p.name === form.project);
  const team = project ? members.filter((m) => project.memberIds.includes(m.id)) : members;
  const options = [...team].sort((a, b) => a.load - b.load);
  const selected = members.find((m) => m.id === form.memberId);

  const close = () => {
    setForm(fresh());
    setErrors({});
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.title.trim()) next.title = 'Escribí un título.';
    if (hours <= 0) next.hours = 'Indicá las horas.';
    if (!selected) next.memberId = 'Elegí a quién asignarla.';else
    if (projected(selected) > SAFE_LOAD) next.memberId = `Superaría el ${SAFE_LOAD}% de carga.`;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave(selected, {
      id: `t${Date.now()}`,
      title: form.title.trim(),
      project: form.project,
      hours,
      due: form.due ? format(new Date(`${form.due}T12:00`), 'dd MMM', { locale: es }) : 'Sin fecha'
    });
    setForm(fresh());
    setErrors({});
  };

  return (
    <Modal open={open} onClose={close} labelledBy="new-team-task-title" wide>
      <h2 id="new-team-task-title" className="modal-title">
        Crear y asignar nueva tarea
      </h2>

      <form className="assign-form" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="tt-title" className="field__label">Título de la tarea</label>
          <input
            id="tt-title"
            className={errors.title ? 'input input--sm input--error' : 'input input--sm'}
            placeholder="Ej. Validación de integración API de Pagos"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            aria-invalid={Boolean(errors.title)} />
          
          {errors.title && <p className="field__error">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="tt-desc" className="field__label">Descripción</label>
          <input
            id="tt-desc"
            className="input input--sm"
            placeholder="Qué hay que hacer y para qué"
            value={form.description}
            onChange={(e) => set('description', e.target.value)} />
          
        </div>

        <div className="assign-row">
          <div>
            <label htmlFor="tt-project" className="field__label">Proyecto asociado</label>
            <select
              id="tt-project"
              className="select"
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value, memberId: '' })}>
              
              {projects.map((p) =>
              <option key={p.id}>{p.name}</option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor="tt-hours" className="field__label">Horas estimadas</label>
            <input
              id="tt-hours"
              type="number"
              min="1"
              max="40"
              className={errors.hours ? 'input input--sm input--error' : 'input input--sm'}
              placeholder="6"
              value={form.hours}
              onChange={(e) => set('hours', e.target.value)}
              aria-invalid={Boolean(errors.hours)} />
            
            {errors.hours && <p className="field__error">{errors.hours}</p>}
          </div>
          <div>
            <label htmlFor="tt-due" className="field__label">Fecha de vencimiento</label>
            <input
              id="tt-due"
              type="date"
              className="input input--sm"
              value={form.due}
              onChange={(e) => set('due', e.target.value)} />
            
          </div>
        </div>

        <fieldset style={{ border: 0 }}>
          <legend className="field__label" style={{ marginBottom: 6 }}>Asignar a · equipo de {form.project}</legend>
          <div className="assign-options">
            {options.map((m) => {
              const next = projected(m);
              const blocked = next > SAFE_LOAD;
              const isSelected = form.memberId === m.id;
              let className = 'assign-option';
              if (isSelected) className += ' assign-option--selected';
              if (blocked) className += ' assign-option--blocked';
              return (
                <label key={m.id} className={className}>
                  <input
                    type="radio"
                    name="assignee"
                    value={m.id}
                    checked={isSelected}
                    disabled={blocked}
                    onChange={() => set('memberId', m.id)} />
                  
                  <Avatar initials={m.name.slice(0, 1)} color={blocked ? '#F3D9D3' : `${m.color}40`} size="sm" />
                  <div className="assign-option__body">
                    <p className="assign-option__name">
                      {m.name} <span className="assign-option__meta">({m.role})</span>
                    </p>
                    <p className="assign-option__meta">
                      Carga actual: {m.hours}h/{WEEKLY_HOURS}h ({m.load}%)
                      {hours > 0 && ` → Proyectada: ${next}%`}
                    </p>
                  </div>
                  {blocked ?
                  <Pill tone="red" dot>No recomendada</Pill> :

                  <Pill tone="green" dot>{hours > 0 ? 'Equilibrada · Apta' : 'Disponible'}</Pill>
                  }
                </label>);

            })}
          </div>
          {options.length === 0 &&
          <p className="assign-option__meta">Este proyecto todavía no tiene equipo. Sumá integrantes desde Proyectos.</p>
          }
          {errors.memberId && <p className="field__error">{errors.memberId}</p>}
        </fieldset>

        {selected && hours > 0 &&
        <div className="projected" role="status">
            <p className="projected__text">
              <strong>Carga final proyectada: {projected(selected)}%</strong> · Dentro del umbral seguro (≤ {SAFE_LOAD}%)
            </p>
            <div className="projected__track" aria-hidden="true">
              <div className="projected__fill" style={{ width: `${projected(selected)}%` }} />
            </div>
          </div>
        }

        <div className="modal__actions" style={{ marginTop: 4 }}>
          <button type="button" className="btn btn--ghost" onClick={close}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--accent">
            Guardar y asignar
          </button>
        </div>
      </form>
    </Modal>);

}