import React, { useEffect, useState } from 'react';
import { SparklesIcon } from 'lucide-react';
import { Modal } from '../app/Modal';
import { Pill } from '../app/Pill';
import { WEEKLY_HOURS } from '../../data/team';

export function AlertDetailModal({ member, members, onClose, onReassign }) {
  const [step, setStep] = useState('detail');
  const [taskId, setTaskId] = useState('');
  const [toId, setToId] = useState('');

  // Personas con margen, de menor a mayor carga
  const candidates = members.
  filter((m) => member && m.id !== member.id && m.load <= 70).
  sort((a, b) => a.load - b.load);

  useEffect(() => {
    if (!member) return;
    setStep('detail');
    setTaskId(member.suggestedTaskId);
    setToId(candidates[0]?.id ?? '');
  }, [member?.id]);

  if (!member) return <Modal open={false} onClose={onClose} />;

  const suggested = member.tasks.find((t) => t.id === member.suggestedTaskId);
  const task = member.tasks.find((t) => t.id === taskId);
  const receiver = members.find((m) => m.id === toId);
  const percent = (hours) => Math.round(hours / WEEKLY_HOURS * 100);

  return (
    <Modal open onClose={onClose} labelledBy="diag-title" wide>
      <h2 id="diag-title" className="modal-title">
        {step === 'detail' ? `Diagnóstico de carga: ${member.name} (${member.role})` : 'Reasignar tarea'}
      </h2>

      {step === 'detail' ?
      <>
          <div className="diag-stats">
            <div className="diag-stat">
              <p className="diag-stat__label">Capacidad proyectada actual</p>
              <p className="diag-stat__value diag-stat__value--red">{member.load}%</p>
              <Pill tone={member.status.tone} dot>
                {member.load > 90 ? 'Sobrecarga' : 'Carga alta'}
              </Pill>
            </div>
            <div className="diag-stat">
              <p className="diag-stat__label">Horas semanales asignadas</p>
              <p className="diag-stat__value">
                {member.hours}h <small>/ {WEEKLY_HOURS}h</small>
              </p>
            </div>
          </div>

          <p className="diag-label">Tareas activas esta semana ({member.tasks.length})</p>
          <ul className="diag-tasks">
            {member.tasks.map((t) =>
          <li key={t.id} className={t.id === member.suggestedTaskId ? 'diag-task diag-task--flag' : 'diag-task'}>
                <span className="diag-task__name">{t.title}</span>
                <span className="diag-task__hours">{t.hours}h</span>
              </li>
          )}
          </ul>

          {suggested &&
        <div className="recommendation">
              <p className="recommendation__title">
                <SparklesIcon size={14} aria-hidden="true" />
                Recomendación del sistema
              </p>
              Se sugiere redistribuir la tarea <strong>“{suggested.title}”</strong> ({suggested.hours}h) a un
              colaborador con capacidad disponible
              {candidates.length > 0 && ` (ej. ${candidates.slice(0, 2).map((c) => c.name).join(' o ')})`}.
            </div>
        }

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cerrar
            </button>
            <button
            type="button"
            className="btn btn--accent"
            disabled={candidates.length === 0}
            onClick={() => setStep('reassign')}>
            
              Reasignar tarea
            </button>
          </div>
        </> :

      <>
          <p className="diag-label">¿Qué tarea?</p>
          <div className="diag-tasks" role="radiogroup" aria-label="Tarea a reasignar">
            {member.tasks.map((t) =>
          <label key={t.id} className="diag-task">
                <input type="radio" name="task" checked={taskId === t.id} onChange={() => setTaskId(t.id)} />
                <span className="diag-task__name" style={{ flex: 1 }}>
                  {t.title}
                </span>
                <span className="diag-task__hours">{t.hours}h</span>
              </label>
          )}
          </div>

          <label htmlFor="receiver" className="diag-label" style={{ display: 'block' }}>
            ¿A quién?
          </label>
          <select id="receiver" className="select" value={toId} onChange={(e) => setToId(e.target.value)}>
            {candidates.map((c) =>
          <option key={c.id} value={c.id}>
                {c.name} · {c.role} ({c.load}% de carga)
              </option>
          )}
          </select>

          {task && receiver &&
        <p className="projection">
              Después del cambio: {member.name} queda en <strong>{percent(member.hours - task.hours)}%</strong> y{' '}
              {receiver.name} en <strong>{percent(receiver.hours + task.hours)}%</strong>.
            </p>
        }

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setStep('detail')}>
              Volver
            </button>
            <button
            type="button"
            className="btn btn--accent"
            disabled={!task || !receiver}
            onClick={() => onReassign(member, task, receiver)}>
            
              Confirmar reasignación
            </button>
          </div>
        </>
      }
    </Modal>);

}