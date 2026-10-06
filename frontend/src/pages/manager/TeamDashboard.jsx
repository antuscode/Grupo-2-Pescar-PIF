import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CircleCheckIcon, FolderKanbanIcon, SearchIcon, SparklesIcon, Trash2Icon, UserPlusIcon, UsersIcon } from 'lucide-react';
import { Avatar } from '../../components/app/Avatar';
import { Pill } from '../../components/app/Pill';
import { Toast } from '../../components/app/Toast';
import { EmptyState } from '../../components/app/EmptyState';
import { AlertDetailModal } from '../../components/manager/AlertDetailModal';
import { MemberModal } from '../../components/manager/MemberModal';
import { useTeam } from '../../contexts/TeamContext';
import { useAppData } from '../../contexts/AppDataContext';
import { teamInfo } from '../../data/team';
import './team.css';
import '../employee/tasks.css';

export function TeamDashboard() {
  const { members, projects, alerts, balanced, reassign, addMember, removeMember } = useTeam();
  const { user } = useAppData();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [memberModal, setMemberModal] = useState(false);
  const [notice, setNotice] = useState('');
  const [toast, setToast] = useState(location.state?.toast ?? null);
  const closeToast = useCallback(() => setToast(null), []);

  // Limpia el aviso que llegó desde otra pantalla para que no reaparezca
  useEffect(() => {
    if (location.state?.toast) navigate(location.pathname, { replace: true, state: null });
  }, []);

  const selected = members.find((m) => m.id === selectedId) ?? null;
  const visible = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleReassign = (from, task, to) => {
    reassign(from.id, task.id, to.id);
    setSelectedId(null);
    setNotice(`Reasignaste “${task.title}” de ${from.name} a ${to.name}.`);
  };

  const handleAddMember = (data) => {
    addMember(data);
    setMemberModal(false);
    setNotice(`Sumaste a ${data.name} al equipo.`);
  };

  const handleRemove = (member) => {
    removeMember(member.id);
    setNotice(`Quitaste a ${member.name} del equipo.`);
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">{teamInfo.name}</h1>
          <p className="page-subtitle">
            Hola, {user.firstName} · {members.length} {members.length === 1 ? 'integrante' : 'integrantes'}
          </p>
        </div>
        <div className="page-actions">
          {members.length > 0 &&
          <label className="search team-search">
              <SearchIcon size={14} aria-hidden="true" />
              <input
              className="input"
              type="search"
              placeholder="Buscar integrante..."
              aria-label="Buscar integrante"
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
            
            </label>
          }
          <button type="button" className="btn btn--accent" onClick={() => setMemberModal(true)}>
            <UserPlusIcon size={16} aria-hidden="true" />
            Agregar integrante
          </button>
        </div>
      </header>

      {notice &&
      <div className="banner" role="status">
          <CircleCheckIcon size={16} aria-hidden="true" />
          <span className="banner__text">{notice}</span>
        </div>
      }

      <div className="team-grid">
        <div className="team-col">
          <section className="wellbeing" aria-labelledby="wellbeing-title">
            <p id="wellbeing-title" className="wellbeing__label">
              Bienestar general del equipo
            </p>
            <p className="wellbeing__value">{members.length ? `${balanced} de ${members.length}` : '—'}</p>
            <p className="wellbeing__text">
              {members.length ?
              'personas con carga equilibrada esta semana' :
              'Agregá integrantes para empezar a ver cómo viene su carga'}
            </p>
          </section>

          <section className="card" aria-labelledby="load-table-title">
            <div className="card__head">
              <h2 id="load-table-title" className="card__title">
                Carga por integrante
              </h2>
              {members.length > 0 &&
              <Link to="/equipo/tareas" className="link-accent">
                  Asignar tareas
                </Link>
              }
            </div>

            {members.length === 0 ?
            <EmptyState
              compact
              icon={UsersIcon}
              title="Tu equipo está vacío"
              text="Sumá a las personas de tu equipo. Después podés armar proyectos y asignarles tareas.">
              
                <button type="button" className="btn btn--accent btn--sm" onClick={() => setMemberModal(true)}>
                  <UserPlusIcon size={14} aria-hidden="true" />
                  Agregar el primer integrante
                </button>
              </EmptyState> :

            <div style={{ overflowX: 'auto' }}>
                <table className="load-table">
                  <thead>
                    <tr>
                      <th>Integrante</th>
                      <th>Carga</th>
                      <th>Estado</th>
                      <th>
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((m) =>
                  <tr key={m.id}>
                        <td>
                          <div className="member">
                            <Avatar initials={m.name.slice(0, 1)} color={`${m.color}33`} />
                            <div>
                              <p className="member__name">{m.name}</p>
                              <p className="member__role">{m.role}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="meter">
                            <div className="meter__track" aria-hidden="true">
                              <div
                            className={`meter__fill meter__fill--${m.status.tone}`}
                            style={{ width: `${Math.min(m.load, 100)}%` }} />
                          
                            </div>
                            <span className="meter__value">{m.load}%</span>
                          </div>
                        </td>
                        <td>
                          <Pill tone={m.status.tone} dot>
                            {m.load === 0 ? 'Sin tareas' : m.status.label}
                          </Pill>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                        type="button"
                        className="row-menu__button"
                        aria-label={
                        m.tasks.length ? `${m.name} tiene tareas asignadas` : `Quitar a ${m.name} del equipo`
                        }
                        title={m.tasks.length ? 'Reasigná sus tareas antes de quitarlo' : 'Quitar del equipo'}
                        disabled={m.tasks.length > 0}
                        style={{ opacity: m.tasks.length ? 0.35 : 1 }}
                        onClick={() => handleRemove(m)}>
                        
                            <Trash2Icon size={15} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
                {visible.length === 0 && <p className="task-empty">No encontramos a nadie con ese nombre.</p>}
              </div>
            }
          </section>
        </div>

        <div className="team-col">
          <section className="card" aria-labelledby="projects-count">
            <div className="card__head">
              <h2 id="projects-count" className="card__title">
                Proyectos
              </h2>
              <Link to="/equipo/proyectos" className="link-accent">
                {projects.length ? 'Ver proyectos' : 'Crear proyecto'}
              </Link>
            </div>
            <div className="recognitions-stat">
              <p className="recognitions-stat__value">{projects.length}</p>
              <p className="recognitions-stat__label">
                {projects.length === 1 ? 'proyecto activo' : 'proyectos activos'}
              </p>
            </div>
          </section>

          <section aria-labelledby="alerts-title" className="team-col" style={{ gap: 12 }}>
            <h2 id="alerts-title" className="section-title">
              Alertas activas
            </h2>
            {alerts.length === 0 &&
            <p className="alerts-empty">
                {members.length ?
              'No hay alertas activas. Todo el equipo tiene una carga sostenible.' :
              'Las alertas aparecen cuando alguien supera el 75% de su capacidad.'}
              </p>
            }
            {alerts.map((m) =>
            <article key={m.id} className="alert-card">
                <p className="alert-card__title">
                  <SparklesIcon size={12} aria-hidden="true" />
                  {m.name} — {m.role}
                </p>
                <p className="alert-card__text">{m.alert}</p>
                <button type="button" className="btn btn--dark btn--sm" onClick={() => setSelectedId(m.id)}>
                  Ver detalle
                </button>
              </article>
            )}
          </section>

          {members.length > 0 && projects.length === 0 &&
          <Link to="/equipo/proyectos" className="lumi-card" style={{ textDecoration: 'none' }}>
              <FolderKanbanIcon size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
              <span>
                <span className="lumi-card__title">Siguiente paso</span>
                <span className="lumi-card__text" style={{ display: 'block' }}>
                  Creá un proyecto y asignale su equipo para empezar a repartir tareas.
                </span>
              </span>
            </Link>
          }
        </div>
      </div>

      <Toast toast={toast} onClose={closeToast} />

      <MemberModal
        open={memberModal}
        existingNames={members.map((m) => m.name)}
        onClose={() => setMemberModal(false)}
        onSave={handleAddMember} />
      

      <AlertDetailModal
        member={selected}
        members={members}
        onClose={() => setSelectedId(null)}
        onReassign={handleReassign} />
      
    </>);

}