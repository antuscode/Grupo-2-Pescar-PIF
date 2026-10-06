import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { MailCheckIcon } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { BackLink } from '../components/auth/BackLink';
import { InlineLink } from '../components/auth/InlineLink';
import { PrimaryButton } from '../components/auth/PrimaryButton';
import { TextField } from '../components/auth/TextField';
import { roles } from '../data/roles';
import { validateEmail } from '../utils/validation';

// status puede ser: 'idle' (formulario), 'loading' (enviando) o 'sent' (enviado)
export function ForgotPassword() {
  const { role: roleId } = useParams();
  const role = roles.find((r) => r.id === roleId);

  const [email, setEmail] = useState('');
  const [error, setError] = useState(undefined);
  const [status, setStatus] = useState('idle');

  if (!role) return <Navigate to="/" replace />;
  const base = `/ingresar/${role.id}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validateEmail(email);
    setError(next);
    if (next) return;
    setStatus('loading');
    setTimeout(() => setStatus('sent'), 900);
  };

  return (
    <AuthLayout>
      <main className="auth-main">
        <div className="auth-box">
          <BackLink to={base}>Volver al inicio de sesión</BackLink>

          <h1 className="auth-title">¿Olvidaste tu contraseña?</h1>

          {status === 'sent' ?
          <>
              <div role="status" className="alert alert--success">
                <MailCheckIcon size={16} className="alert__icon" aria-hidden="true" />
                <div>
                  <p className="alert__title">Revisá tu correo</p>
                  <p className="alert__text">
                    Si <strong>{email.trim()}</strong> tiene una cuenta, te enviamos un
                    enlace para restablecer tu contraseña.
                  </p>
                </div>
              </div>
              <div className="after-alert">
                <button
                type="button"
                onClick={() => setStatus('idle')}
                className="text-link">
                
                  Usar otro correo
                </button>
              </div>
            </> :

          <>
              <p className="auth-lead">
                Ingresá tu correo electrónico y te enviaremos un enlace para
                restablecer tu contraseña.
              </p>
              <form onSubmit={handleSubmit} noValidate className="form">
                <TextField
                id="email"
                type="email"
                label="Correo electrónico"
                autoComplete="email"
                placeholder="nombre@empresa.com"
                value={email}
                onChange={setEmail}
                error={error} />
              
                <PrimaryButton loading={status === 'loading'} loadingLabel="Enviando…">
                  Enviar enlace de recuperación
                </PrimaryButton>
              </form>
            </>
          }

          <p className="auth-footer auth-footer--spaced">
            ¿Recordaste tu contraseña? <InlineLink to={base}>Iniciar sesión</InlineLink>
          </p>
        </div>
      </main>
    </AuthLayout>);

}