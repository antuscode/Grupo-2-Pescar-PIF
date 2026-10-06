import React, { useState } from 'react';
import { CheckIcon, HandshakeIcon, LockIcon, Share2Icon, SproutIcon, TrophyIcon } from 'lucide-react';
import { Modal } from '../../components/app/Modal';
import { useAppData } from '../../contexts/AppDataContext';
import { computeAchievements } from '../../utils/achievements';
import './community.css';

const icons = { sprout: SproutIcon, handshake: HandshakeIcon, trophy: TrophyIcon };

export function Achievements() {
  const { tasks, recognitions } = useAppData();
  const { summary: pointsSummary, badges, trophy, history: pointsHistory } = computeAchievements(tasks, recognitions);
  const [selected, setSelected] = useState(null);
  const [shared, setShared] = useState([]);

  const isShared = selected && shared.includes(selected.id);
  const SelectedIcon = selected ? icons[selected.icon] : null;

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Mis logros</h1>
          <p className="page-subtitle">Gamificación sana: sin comparaciones entre pares</p>
        </div>
      </header>

      <section className="points-hero" aria-labelledby="points-title">
        <div>
          <h2 id="points-title" className="points-hero__value">
            {pointsSummary.points} pts
          </h2>
          <p className="points-hero__level">
            Nivel {pointsSummary.level} · faltan {pointsSummary.missing} pts para “{pointsSummary.nextTitle}”
          </p>
          <div
            className="progress"
            role="progressbar"
            aria-valuenow={pointsSummary.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso al siguiente nivel">
            
            <div className="progress__fill" style={{ width: `${pointsSummary.progress}%` }} />
          </div>
        </div>
        <button
          type="button"
          className="trophy-button"
          aria-label={`Ver trofeo ${trophy.name}`}
          onClick={() => setSelected(trophy)}>
          
          <TrophyIcon size={24} aria-hidden="true" />
        </button>
      </section>

      <div className="achievements-grid">
        <section className="card" aria-labelledby="badges-title">
          <h2 id="badges-title" className="card__title" style={{ marginBottom: 16 }}>
            Insignias
          </h2>
          <div className="badge-grid">
            {badges.map((badge) => {
              const Icon = icons[badge.icon];
              return (
                <button
                  key={badge.id}
                  type="button"
                  className={badge.earned ? 'badge-tile' : 'badge-tile badge-tile--locked'}
                  onClick={() => setSelected(badge)}>
                  
                  <span className="badge-tile__icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="badge-tile__name">{badge.name}</span>
                  <span className="badge-tile__caption">{badge.earned ? badge.caption : 'Bloqueada'}</span>
                </button>);

            })}
          </div>
        </section>

        <section className="card" aria-labelledby="history-title">
          <h2 id="history-title" className="card__title" style={{ marginBottom: 8 }}>
            Historial reciente
          </h2>
          {pointsHistory.length === 0 ?
          <p className="detail-text" style={{ marginTop: 8 }}>
              Completá tareas o reconocé a un compañero para empezar a sumar puntos.
            </p> :

          <ul className="history-list">
              {pointsHistory.map((item) =>
            <li key={item.id} className="history-item">
                  <span>{item.text}</span>
                  <span className="history-item__points">{item.points}</span>
                </li>
            )}
            </ul>
          }
        </section>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} labelledBy="badge-title">
        {selected &&
        <div className={selected.earned ? 'badge-detail' : 'badge-detail badge-detail--locked'}>
            <div className="badge-detail__icon" aria-hidden="true">
              {selected.earned ? <SelectedIcon size={30} /> : <LockIcon size={26} />}
            </div>
            <h2 id="badge-title" className="badge-detail__title">
              {selected.name}
            </h2>
            <p className="badge-detail__text">{selected.description}</p>
            <p className={selected.highlight ? 'badge-detail__date badge-detail__date--highlight' : 'badge-detail__date'}>
              {selected.date}
            </p>
            {selected.earned &&
          <button
            type="button"
            className={`btn btn--block ${selected.highlight ? 'btn--accent' : 'btn--dark'}`}
            disabled={isShared}
            onClick={() => setShared([...shared, selected.id])}>
            
                {isShared ? <CheckIcon size={14} aria-hidden="true" /> : <Share2Icon size={14} aria-hidden="true" />}
                {isShared ? 'Compartido con tu equipo' : 'Compartir con el equipo'}
              </button>
          }
          </div>
        }
      </Modal>
    </>);

}