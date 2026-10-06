import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleCheckIcon, LockIcon, MailCheckIcon, MailIcon, SaveIcon, ShieldCheckIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { BackLink } from '../../components/auth/BackLink';
import { Pill } from '../../components/app/Pill';
import { validateEmail } from '../../utils/validation';
import './profile.css';

const STEPS = [
{ title: 'Guardás el nuevo email', text: 'Revisamos que el formato sea correcto.' },
{ title: 'Recibís un correo', text: 'El enlace vence 24 horas después del envío.' },
{ title: 'Confirmás el cambio', text: 'Desde ese momento ingresás con el nuevo email.' }];


export function EditEmail() {
  const { user, updateUser } = useAppData();
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let next = validateEmail(newEmail);
    if (!next && newEmail.trim() === user.email) next = 'Ese ya es tu email actual.';
    setError(next ?? '');
    if (next) return;
    updateUser({ pendingEmail: newEmail.trim() });
    setSaved(true);
  };

  return (
    <>
      <BackLink to="/app/perfil">Perfil y configuración</BackLink>
      <h1 className="page-title" style={{ marginTop: 12 }}>
        Cambiar email
      </h1>
      <p className="page-subtitle" style={{ marginBottom: 24 }}>
        Actualizá el email que usás para ingresar a Lumora y recibir notificaciones importantes de tu cuenta.
      </p>

      <div className="email-grid">
        <section className="card email-card">
          {saved ?
          <>
              <div className="notice" role="status" style={{ marginTop: 0 }}>
                <MailCheckIcon size={16} aria-hidden="true" />
                <div>
                  <p className="notice__title">Revisá tu bandeja de entrada</p>
                  <p>
                    Te enviamos un enlace a <strong>{user.pendingEmail}</strong>. Tu email actual sigue activo
                    hasta que confirmes el cambio.
                  </p>
                </div>
              </div>
              <div className="email-footer">
                <span className="email-footer__note">Podés cerrar esta pantalla.</span>
                <Link to="/app/perfil" className="btn btn--dark">
                  Volver al perfil
                </Link>
              </div>
            </> :

          <form onSubmit={handleSubmit} noValidate>
              <div className="email-field">
                <p className="email-field__head">Email actual</p>
                <div className="icon-input">
                  <MailIcon size={16} aria-hidden="true" />
                  <input className="input input--readonly" value={user.email} readOnly aria-label="Email actual" />
                  <Pill tone="green">
                    <CircleCheckIcon size={12} aria-hidden="true" />
                    Verificado
                  </Pill>
                </div>
              </div>

              <div className="email-field">
                <label htmlFor="new-email" className="email-field__head">
                  Nuevo email <span className="email-field__optional">Obligatorio</span>
                </label>
                <div className="icon-input">
                  <MailIcon size={16} aria-hidden="true" />
                  <input
                  id="new-email"
                  type="email"
                  autoComplete="email"
                  className={error ? 'input input--error' : 'input'}
                  placeholder="nombre@empresa.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'new-email-error' : 'new-email-help'} />
                
                </div>
                {error ?
              <p id="new-email-error" className="field__error">
                    {error}
                  </p> :

              <p id="new-email-help" className="email-help">
                    Asegurate de tener acceso a este correo para poder verificarlo.
                  </p>
              }
                <div className="notice">
                  <ShieldCheckIcon size={16} aria-hidden="true" />
                  <div>
                    <p className="notice__title">Necesitamos verificar tu nuevo email</p>
                    <p>Te vamos a enviar un enlace de verificación. Tu email actual seguirá activo hasta que completes ese paso.</p>
                  </div>
                </div>
              </div>

              <div className="email-footer">
                <span className="email-footer__note">No se cerrará tu sesión actual.</span>
                <div className="page-actions">
                  <Link to="/app/perfil" className="btn btn--ghost">
                    Cancelar
                  </Link>
                  <button type="submit" className="btn btn--dark">
                    <SaveIcon size={14} aria-hidden="true" />
                    Guardar cambios
                  </button>
                </div>
              </div>
            </form>
          }
        </section>

        <aside className="card" aria-labelledby="next-title">
          <div className="side-head">
            <span className="side-head__icon" aria-hidden="true">
              <MailIcon size={16} />
            </span>
            <div>
              <h2 id="next-title" className="card__title">
                ¿Qué pasa después?
              </h2>
              <p className="setting-row__meta">El cambio se confirma en tres pasos.</p>
            </div>
          </div>
          <ol className="steps">
            {STEPS.map((step, i) =>
            <li key={step.title} className="step">
                <span className="step__number">{i + 1}</span>
                <div>
                  <p className="step__title">{step.title}</p>
                  <p className="step__text">{step.text}</p>
                </div>
              </li>
            )}
          </ol>
          <p className="side-note">
            <LockIcon size={14} aria-hidden="true" />
            Por seguridad, también te avisaremos del cambio en tu email actual.
          </p>
        </aside>
      </div>
    </>);

}