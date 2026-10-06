import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CreditCardIcon } from 'lucide-react';
import { Avatar } from '../../components/app/Avatar';
import { useAppData } from '../../contexts/AppDataContext';
import { useTeam } from '../../contexts/TeamContext';
import '../employee/profile.css';

export function ManagerProfile() {
  const { user } = useAppData();
  const { members } = useTeam();
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

      <Link to="/equipo/perfil/suscripcion" className="plan-link">
        <span className="plan-link__icon" aria-hidden="true">
          <CreditCardIcon size={18} />
        </span>
        <div className="plan-link__body">
          <p className="plan-link__title">Suscripción y pago</p>
          <p className="plan-link__meta">
            {user.team} · {members.length} {members.length === 1 ? 'integrante' : 'integrantes'} · plan, método de pago y
            facturas
          </p>
        </div>
        <span className="plan-link__cta">
          Gestionar
          <ArrowRightIcon size={14} aria-hidden="true" />
        </span>
      </Link>

      <div className="profile-grid">
        <section className="card" aria-labelledby="account-title">
          <h2 id="account-title" className="card__label">
            Cuenta
          </h2>
          <div className="setting-row">
            <div>
              <p className="setting-row__title">Email</p>
              <p className="setting-row__meta">{user.email}</p>
            </div>
          </div>
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
    </>);

}