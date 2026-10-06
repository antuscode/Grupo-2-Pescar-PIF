import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, ShieldCheckIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { Avatar } from '../../components/app/Avatar';
import './profile.css';

export function Profile() {
  const { user } = useAppData();
  const [lumiSuggestions, setLumiSuggestions] = useState(true);

  return (
    <>
      <h1 className="page-title" style={{ marginBottom: 24 }}>
        Perfil y configuración
      </h1>

      <div className="profile-head">
        <Avatar initials={user.initials} size="lg" />
        <div>
          <p className="profile-head__name">{user.name}</p>
          <p className="profile-head__meta">
            {user.role} · {user.team}
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <section className="card" aria-labelledby="account-title">
          <h2 id="account-title" className="card__label">
            Cuenta
          </h2>
          <Link to="/app/perfil/email" className="setting-row">
            <div>
              <p className="setting-row__title">Email</p>
              <p className="setting-row__meta">{user.email}</p>
              {user.pendingEmail &&
              <p className="setting-row__pending">Pendiente de verificar: {user.pendingEmail}</p>
              }
            </div>
            <ChevronRightIcon size={16} aria-hidden="true" />
          </Link>
          <div className="setting-row">
            <div>
              <p className="setting-row__title">Contraseña</p>
              <p className="setting-row__meta">{user.passwordUpdated}</p>
            </div>
          </div>
        </section>

        <section className="card" aria-labelledby="security-title">
          <h2 id="security-title" className="card__label">
            Seguridad
          </h2>
          <div className="setting-row">
            <div>
              <p className="setting-row__title">Historial de inicio de sesión</p>
              <p className="setting-row__meta">{user.lastLogin}</p>
            </div>
          </div>
          <div className="setting-row">
            <p className="setting-row__title" id="lumi-switch-label">
              Sugerencias de Lumi
            </p>
            <button
              type="button"
              role="switch"
              className="switch"
              aria-checked={lumiSuggestions}
              aria-labelledby="lumi-switch-label"
              onClick={() => setLumiSuggestions(!lumiSuggestions)} />
            
          </div>
        </section>
      </div>

      <section className="card profile-wide" aria-labelledby="privacy-title">
        <h2 id="privacy-title" className="card__label">
          Privacidad
        </h2>
        <p className="notice">
          <ShieldCheckIcon size={16} aria-hidden="true" />
          Tu carga laboral detallada solo la ven vos y tu líder directo. Nunca se comparte con tus pares
          ni se usa para armar rankings.
        </p>
      </section>
    </>);

}