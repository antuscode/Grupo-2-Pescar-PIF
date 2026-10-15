import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AlertCircleIcon } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { BackLink } from '../components/auth/BackLink';
import { InlineLink } from '../components/auth/InlineLink';
import { PasswordField } from '../components/auth/PasswordField';
import { PrimaryButton } from '../components/auth/PrimaryButton';
import { TextField } from '../components/auth/TextField';
import { roles } from '../data/roles';
import { roleFromDb, useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/validation';

export function Login() {
  const { role: roleId } = useParams();
  const navigate = useNavigate();
  const role = roles.find((r) => r.id === roleId);
  const { signIn, signOut } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authFailed, setAuthFailed] = useState(false);
  const [failText, setFailText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!role) return <Navigate to="/" replace />;
  const base = `/ingresar/${role.id}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {
      email: validateEmail(email),
      password: password ? undefined : 'Ingresá tu contraseña.'
    };
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    setAuthFailed(false);
    const { error, profile } = await signIn(email.trim(), password);

    if (error) {
      setLoading(false);
      setAuthFailed(true);
      setFailText(error);
      setErrors({ password: 'Verificá que la contraseña esté escrita correctamente.' });
      return;
    }

    // Si entró por el perfil equivocado (ej. un empleado en "Soy Líder"), se corta la sesión
    if (profile && roleFromDb(profile.role) !== role.id) {
      await signOut();
      setLoading(false);
      setAuthFailed(true);
      setFailText(`Esta cuenta no es de ${role.credentialLabel}. Volvé y elegí tu perfil correcto.`);
      return;
    }

    setLoading(false);
    navigate(`${base}/bienvenida`);
  };

  return (
    <AuthLayout>
      <main className="auth-main">
        <div className="auth-box">
          <BackLink to="/perfil">Cambiar perfil</BackLink>

          <h1 className="auth-title">Ingresá a tu espacio</h1>
          <p className="auth-lead">
            Usá tus credenciales de {role.credentialLabel} para continuar.
          </p>

          {authFailed &&
          <div role="alert" className="alert alert--error">
              <AlertCircleIcon size={16} className="alert__icon" aria-hidden="true" />
              <div>
                <p className="alert__title">No pudimos iniciar sesión</p>
                <p className="alert__text">{failText}</p>
              </div>
            </div>
          }

          <form onSubmit={handleSubmit} noValidate className="form">
            <TextField
              id="email"
              type="email"
              label="Correo electrónico"
              autoComplete="email"
              placeholder="nombre@empresa.com"
              value={email}
              onChange={setEmail}
              error={errors.email} />
            
            <div>
              <PasswordField
                id="password"
                label="Contraseña"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={setPassword}
                error={errors.password} />
              
              <div className="forgot-row">
                <Link to={`${base}/recuperar`} className="text-link">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <PrimaryButton loading={loading} loadingLabel="Ingresando…">
              {authFailed ? 'Volver a intentar' : 'Ingresar'}
            </PrimaryButton>

            <p className="auth-footer">
              ¿Todavía no tenés una cuenta?{' '}
              <InlineLink to={`${base}/crear-cuenta`}>Crear cuenta</InlineLink>
            </p>
          </form>
        </div>
      </main>
    </AuthLayout>);

}