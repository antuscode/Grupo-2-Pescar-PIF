import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleCheckIcon } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordField } from '../components/auth/PasswordField';
import { PrimaryButton } from '../components/auth/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { MIN_PASSWORD_LENGTH } from '../utils/validation';

// Se llega desde el enlace del email de recuperación (Supabase crea una sesión temporal).
export function ResetPassword() {
  const { session, loading, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (password.length < MIN_PASSWORD_LENGTH) next.password = `Usá al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    if (confirm !== password) next.confirm = 'Las contraseñas no coinciden.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    const { error } = await updatePassword(password);
    setSaving(false);
    if (error) {
      setErrors({ password: error });
      return;
    }
    setDone(true);
  };

  return (
    <AuthLayout>
      <main className="auth-main">
        <div className="auth-box">
          <h1 className="auth-title">Nueva contraseña</h1>

          {loading ? <p className="auth-lead">Verificando enlace…</p> :
          !session ?
          <>
              <p className="auth-lead">El enlace venció o ya se usó. Pedí uno nuevo para continuar.</p>
              <Link to="/perfil" className="text-link">Volver al inicio</Link>
            </> :
          done ?
          <div role="status" className="alert alert--success">
              <CircleCheckIcon size={16} className="alert__icon" aria-hidden="true" />
              <div>
                <p className="alert__title">Contraseña actualizada</p>
                <p className="alert__text">Ya podés seguir usando Lumora. <Link to="/perfil" className="text-link">Ir a mi espacio</Link></p>
              </div>
            </div> :

          <form onSubmit={handleSubmit} noValidate className="form">
              <PasswordField id="password" label="Nueva contraseña" autoComplete="new-password"
            placeholder="Creá una contraseña" value={password} onChange={setPassword} error={errors.password} />
              <PasswordField id="confirm" label="Confirmar contraseña" autoComplete="new-password"
            placeholder="Repetí tu contraseña" value={confirm} onChange={setConfirm} error={errors.confirm} />
              <PrimaryButton loading={saving} loadingLabel="Guardando…">Guardar contraseña</PrimaryButton>
            </form>
          }
        </div>
      </main>
    </AuthLayout>);

}
