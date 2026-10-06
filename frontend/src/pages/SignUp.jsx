import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { BackLink } from '../components/auth/BackLink';
import { InlineLink } from '../components/auth/InlineLink';
import { PasswordField } from '../components/auth/PasswordField';
import { PrimaryButton } from '../components/auth/PrimaryButton';
import { TextField } from '../components/auth/TextField';
import { roles } from '../data/roles';
import { useAppData } from '../contexts/AppDataContext';
import { MIN_PASSWORD_LENGTH, validateEmail } from '../utils/validation';

export function SignUp() {
  const { role: roleId } = useParams();
  const navigate = useNavigate();
  const role = roles.find((r) => r.id === roleId);
  const { signIn } = useAppData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!role) return <Navigate to="/" replace />;
  const base = `/ingresar/${role.id}`;

  const handleSubmit = (e) => {
    e.preventDefault();

    const next = {};
    if (!name.trim()) next.name = 'Ingresá tu nombre y apellido.';
    next.email = validateEmail(email);
    if (!password) next.password = 'Creá una contraseña.';else
    if (password.length < MIN_PASSWORD_LENGTH)
    next.password = `Usá al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    if (!confirm) next.confirm = 'Repetí tu contraseña.';else
    if (confirm !== password) next.confirm = 'Las contraseñas no coinciden.';
    if (!terms) next.terms = 'Necesitás aceptar los términos para continuar.';

    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setLoading(true);
    setTimeout(() => {
      signIn({ name: name.trim(), email: email.trim(), role: role.id });
      navigate(`${base}/bienvenida`);
    }, 900);
  };

  return (
    <AuthLayout>
      <main className="auth-main">
        <div className="auth-box">
          <BackLink to={base}>Volver al inicio de sesión</BackLink>

          <h1 className="auth-title">Creá tu cuenta</h1>
          <p className="auth-lead">
            Completá tus datos para empezar a cuidar la energía de tu equipo.
          </p>

          <form onSubmit={handleSubmit} noValidate className="form">
            <TextField
              id="name"
              label="Nombre y apellido"
              autoComplete="name"
              placeholder="Ingresá tu nombre completo"
              value={name}
              onChange={setName}
              error={errors.name} />
            
            <TextField
              id="email"
              type="email"
              label="Correo electrónico"
              autoComplete="email"
              placeholder="nombre@empresa.com"
              value={email}
              onChange={setEmail}
              error={errors.email} />
            
            <PasswordField
              id="password"
              label="Contraseña"
              autoComplete="new-password"
              placeholder="Creá una contraseña"
              value={password}
              onChange={setPassword}
              error={errors.password} />
            
            <PasswordField
              id="confirm"
              label="Confirmar contraseña"
              autoComplete="new-password"
              placeholder="Repetí tu contraseña"
              value={confirm}
              onChange={setConfirm}
              error={errors.confirm} />
            

            <div>
              <label className="checkbox">
                <span className="checkbox__box">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    aria-invalid={Boolean(errors.terms)}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                    className={
                    errors.terms ?
                    'checkbox__input checkbox__input--error' :
                    'checkbox__input'
                    } />
                  
                  <CheckIcon
                    size={12}
                    strokeWidth={3}
                    className="checkbox__check"
                    aria-hidden="true" />
                  
                </span>
                <span>Acepto los Términos y condiciones y la Política de privacidad.</span>
              </label>
              {errors.terms &&
              <p id="terms-error" className="field__error">
                  {errors.terms}
                </p>
              }
            </div>

            <PrimaryButton loading={loading} loadingLabel="Creando cuenta…">
              Crear cuenta
            </PrimaryButton>

            <p className="auth-footer">
              ¿Ya tenés una cuenta? <InlineLink to={base}>Ingresar</InlineLink>
            </p>
          </form>
        </div>
      </main>
    </AuthLayout>);

}