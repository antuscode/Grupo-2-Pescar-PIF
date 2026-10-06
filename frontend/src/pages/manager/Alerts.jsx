import React, { useState } from 'react';
import { AlertTriangleIcon, BellRingIcon, CheckIcon, CircleCheckIcon, SearchIcon, ShieldCheckIcon, SparkleIcon } from 'lucide-react';
import { useTeam } from '../../contexts/TeamContext';
import { Pill } from '../../components/app/Pill';
import { EmptyState } from '../../components/app/EmptyState';
import { AlertDetailModal } from '../../components/manager/AlertDetailModal';
import { ALERT_LOAD } from '../../data/team';
import '../employee/tasks.css';
import './insights.css';

const TABS = [
{ id: 'active', label: 'Activas' },
{ id: 'postponed', label: 'Pospuestas' },
{ id: 'resolved', label: 'Resueltas' }];


const statusLabel = { active: 'Nueva', postponed: 'Pospuesta', resolved: 'Resuelta' };
const statusTone = { active: 'amber', postponed: 'neutral', resolved: 'green' };

// Las alertas se crean solas cuando un integrante supera el 75% de su capacidad.
// Acá el líder puede posponerlas o marcarlas como resueltas.
export function Alerts() {
  const { members, alerts: overloadedMembers, balanced, reassign } = useTeam();
  const [states, setStates] = useState({}); // { memberId: 'postponed' | 'resolved' }
  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');
  const [detailMemberId, setDetailMemberId] = useState(null);
  const [notice, setNotice] = useState('');

  const alerts = overloadedMembers.map((m) => ({
    id: m.id,
    member: m,
    title: `Carga laboral alta de ${m.name}`,
    description: m.alert,
    priority: m.load > 90 ? 'Alta' : 'Media',
    state: states[m.id] ?? 'active'
  }));

  const count = (state) => alerts.filter((a) => a.state === state).length;
  const wellbeing = members.length ? Math.round(balanced / members.length * 100) : 0;

  const visible = alerts.filter((a) => {
    if (a.state !== tab) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const moveTo = (id, state, message) => {
    setStates({ ...states, [id]: state });
    setNotice(message);
  };

  const handleReassign = (from, task, to) => {
    reassign(from.id, task.id, to.id);
    setDetailMemberId(null);
    setNotice(`Reasignaste “${task.title}” a ${to.name}.`);
  };

  const active = alerts.filter((a) => a.state === 'active');

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Alertas</h1>
          <p className="page-subtitle">Detectá señales a tiempo y acompañá la carga del equipo.</p>
        </div>
      </header>

      {notice &&
      <div className="banner" role="status">
          <CircleCheckIcon size={16} aria-hidden="true" />
          <span className="banner__text">{notice}</span>
        </div>
      }

      <div className="kpis">
        <div className="kpi kpi--primary">
          <div>
            <p className="kpi__label">Alertas activas</p>
            <p className="kpi__value">{count('active')}</p>
            <p className="kpi__text">Integrantes por encima del {ALERT_LOAD}% de carga</p>
          </div>
          <span className="kpi__icon kpi__icon--light" aria-hidden="true">
            <BellRingIcon size={16} />
          </span>
        </div>
        <div className="kpi">
          <div>
            <p className="kpi__label">Pospuestas</p>
            <p className="kpi__value">{count('postponed')}</p>
            <p className="kpi__text">Para revisar más adelante</p>
          </div>
          <span className="kpi__icon kpi__icon--red" aria-hidden="true">
            <AlertTriangleIcon size={16} />
          </span>
        </div>
        <div className="kpi">
          <div>
            <p className="kpi__label">Resueltas</p>
            <p className="kpi__value">{count('resolved')}</p>
            <p className="kpi__text">Acciones que mejoran el bienestar del equipo</p>
          </div>
          <span className="kpi__icon kpi__icon--green" aria-hidden="true">
            <CircleCheckIcon size={16} />
          </span>
        </div>
      </div>

      <div className="line-tabs" role="tablist" aria-label="Estado de las alertas">
        {TABS.map((t) =>
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={tab === t.id}
          className={tab === t.id ? 'line-tabs__tab line-tabs__tab--active' : 'line-tabs__tab'}
          onClick={() => setTab(t.id)}>
          
            {t.label}
            <span className="line-tabs__count">{count(t.id)}</span>
          </button>
        )}
      </div>

      {alerts.length > 0 &&
      <div className="insight-filters">
          <label className="search">
            <SearchIcon size={14} aria-hidden="true" />
            <input
            className="input"
            type="search"
            placeholder="Buscar integrante..."
            aria-label="Buscar integrante"
            value={search}
            onChange={(e) => setSearch(e.target.value)} />
          
          </label>
        </div>
      }

      <div className="insight-grid">
        <section aria-labelledby="alerts-list-title">
          <div className="insight-list-head">
            <h2 id="alerts-list-title" className="card__title">
              Alertas {TABS.find((t) => t.id === tab).label.toLowerCase()}
            </h2>
          </div>

          <div className="insight-list">
            {visible.map((a) =>
            <article key={a.id} className="insight-card">
                <div className="insight-card__head">
                  <AlertTriangleIcon size={16} className="icon-warning" aria-hidden="true" />
                  <h3 className="insight-card__title">{a.title}</h3>
                  <Pill tone={statusTone[a.state]}>{statusLabel[a.state]}</Pill>
                </div>
                <p className="insight-card__text">{a.description}</p>
                <div className="insight-card__meta">
                  <Pill tone={a.priority === 'Alta' ? 'red' : 'amber'}>Prioridad {a.priority.toLowerCase()}</Pill>
                  <strong>{a.member.name}</strong>· {a.member.role}
                </div>
                <div className="insight-card__actions">
                  {a.state !== 'resolved' &&
                <button type="button" className="btn btn--dark btn--sm" onClick={() => setDetailMemberId(a.id)}>
                      Ver detalle
                    </button>
                }
                  {a.state !== 'resolved' ?
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => moveTo(a.id, 'resolved', `Marcaste “${a.title}” como resuelta.`)}>
                  
                      <CheckIcon size={14} aria-hidden="true" />
                      Marcar como resuelta
                    </button> :

                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => moveTo(a.id, 'active', `Reabriste “${a.title}”.`)}>
                  
                      Reabrir
                    </button>
                }
                  {a.state === 'active' &&
                <button
                  type="button"
                  className="link-accent"
                  onClick={() => moveTo(a.id, 'postponed', `Pospusiste “${a.title}”.`)}>
                  
                      Posponer
                    </button>
                }
                  {a.state === 'postponed' &&
                <button
                  type="button"
                  className="link-accent"
                  onClick={() => moveTo(a.id, 'active', `Volviste a activar “${a.title}”.`)}>
                  
                      Volver a activas
                    </button>
                }
                </div>
              </article>
            )}
            {visible.length === 0 &&
            <EmptyState
              compact
              icon={BellRingIcon}
              title={alerts.length === 0 ? 'No hay alertas' : 'No hay alertas en esta vista'}
              text={
              alerts.length === 0 ?
              members.length ?
              `Nadie supera el ${ALERT_LOAD}% de su capacidad. Las alertas aparecen solas cuando eso pasa.` :
              'Cuando agregues integrantes y les asignes tareas, las alertas de carga aparecen acá.' :
              undefined
              } />

            }
          </div>

          <p className="insight-privacy">
            <ShieldCheckIcon size={14} aria-hidden="true" />
            Las alertas son confidenciales y solo se comparten con los líderes del equipo para acompañar su bienestar.
          </p>
        </section>

        <aside className="team-col" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="side-hero">
            <p className="side-hero__label">Bienestar general</p>
            <p className="side-hero__value">{members.length ? `${wellbeing}%` : '—'}</p>
            <p className="side-hero__text">
              {members.length ?
              `${balanced} de ${members.length} integrantes en zona equilibrada.` :
              'Todavía no hay integrantes en el equipo.'}
            </p>
          </div>

          <section className="card" aria-labelledby="lumi-suggest">
            <h2 id="lumi-suggest" className="card__title suggestion-head">
              <SparkleIcon size={16} aria-hidden="true" />
              Sugerencias de Lumi
            </h2>
            {active.length === 0 ?
            <p className="insight-card__text">No hay nada urgente. Seguí repartiendo el trabajo de forma pareja.</p> :

            <ul className="suggestion-list">
                {active.map((a) =>
              <li key={a.id} className="suggestion">
                    <span className="suggestion__check" aria-hidden="true">
                      <CheckIcon size={12} />
                    </span>
                    <div>
                      <p className="suggestion__title">Revisar las tareas de {a.member.name}</p>
                      <p className="suggestion__text">
                        Está en {a.member.load}%. Abrí el detalle para pasar una tarea a alguien con margen.
                      </p>
                    </div>
                  </li>
              )}
              </ul>
            }
          </section>
        </aside>
      </div>

      <AlertDetailModal
        member={members.find((m) => m.id === detailMemberId) ?? null}
        members={members}
        onClose={() => setDetailMemberId(null)}
        onReassign={handleReassign} />
      
    </>);

}