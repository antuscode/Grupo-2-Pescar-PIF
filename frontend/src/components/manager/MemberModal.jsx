import React, { useEffect, useState } from 'react';
import { Modal } from '../app/Modal';
import { validateEmail } from '../../utils/validation';

// Ventana para sumar un integrante al equipo
export function MemberModal({ open, existingNames, onClose, onSave }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  // Cada vez que se abre, arranca vacía
  useEffect(() => {
    if (!open) return;
    setName('');
    setRole('');
    setEmail('');
    setErrors({});
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    const cleanName = name.trim();
    if (!cleanName) next.name = 'Escribí el nombre del integrante.';else
    if (existingNames.some((n) => n.toLowerCase() === cleanName.toLowerCase()))
    next.name = 'Ya hay alguien con ese nombre en el equipo.';
    if (!role.trim()) next.role = 'Escribí su rol o puesto.';
    if (email.trim()) {
      const emailError = validateEmail(email);
      if (emailError) next.email = emailError;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({ name: cleanName, role: role.trim(), email: email.trim() });
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="member-modal-title">
      <h2 id="member-modal-title" className="modal-title">
        Agregar integrante
      </h2>
      <p className="modal-text">Después vas a poder sumarlo a proyectos y asignarle tareas.</p>

      <form className="modal-form" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="member-name" className="form-label">
            Nombre y apellido
          </label>
          <input
            id="member-name"
            className={errors.name ? 'input input--sm input--error' : 'input input--sm'}
            placeholder="Ej. Ana Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'member-name-error' : undefined}
            autoFocus />
          
          {errors.name &&
          <p id="member-name-error" className="field__error">
              {errors.name}
            </p>
          }
        </div>
        <div>
          <label htmlFor="member-role" className="form-label">
            Rol o puesto
          </label>
          <input
            id="member-role"
            className={errors.role ? 'input input--sm input--error' : 'input input--sm'}
            placeholder="Ej. Diseño, Backend, QA…"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? 'member-role-error' : undefined} />
          
          {errors.role &&
          <p id="member-role-error" className="field__error">
              {errors.role}
            </p>
          }
        </div>
        <div>
          <label htmlFor="member-email" className="form-label">
            Email <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(opcional)</span>
          </label>
          <input
            id="member-email"
            type="email"
            className={errors.email ? 'input input--sm input--error' : 'input input--sm'}
            placeholder="nombre@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'member-email-error' : undefined} />
          
          {errors.email &&
          <p id="member-email-error" className="field__error">
              {errors.email}
            </p>
          }
        </div>
        <div className="modal__actions" style={{ marginTop: 4 }}>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--accent">
            Agregar al equipo
          </button>
        </div>
      </form>
    </Modal>);

}