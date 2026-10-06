import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarClockIcon, CheckIcon, ListChecksIcon, PlusIcon, SparklesIcon, TargetIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { EmptyState } from '../../components/app/EmptyState';
import { loadStatus, weeklyLoad } from '../../utils/tasks';
import './dashboard.css';

// Colores de las 5 partes de la barra de carga
const LOAD_SEGMENTS = ['#4DBB8F', '#4DBB8F', '#FFD970', '#FFD970', '#4A5470'];

// Opciones del pulso semanal (las elige la persona tocando cada casilla)
const PULSE = [
{ label: 'Energía', tone: 'green', options: ['Baja', 'Media', 'Bien'] },
{ label: 'Foco', tone: 'amber', options: ['Bajo', 'Medio', 'Alto'] },
{ label: 'Ánimo', tone: 'purple', options: ['Bajo', 'Neutral', 'Positivo'] }];


const loadMessages = {
  green: 'Tenés margen para avanzar sin sobrecargarte.',
  amber: 'Tu semana viene cargada. Revisá qué puede esperar.',
  red: 'Estás por encima de tu capacidad. Conviene mover algo.'
};

export function Dashboard() {
  const { user, tasks, updateTask } = useAppData();
  const [pulse, setPulse] = useState({});

  const active = tasks.filter((t) => !t.completed);
  const done = tasks.length - active.length;
  const load = weeklyLoad(tasks);
  const status = loadStatus(load.percent);

  // Próximas tareas: primero las que vencen pronto
  const upcoming = [...active].sort((a, b) => Number(b.dueSoon) - Number(a.dueSoon)).slice(0, 4);
  // Próximo vencimiento con fecha
  const nextDue = active.
  filter((t) => t.dueAt).
  sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))[0];

  const progress = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  const cyclePulse = (item) => {
    const current = pulse[item.label];
    const index = current ? item.options.indexOf(current) : -1;
    setPulse({ ...pulse, [item.label]: item.options[(index + 1) % item.options.length] });
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Hola, {user.firstName}</h1>
          <p className="page-subtitle" style={{ textTransform: 'none' }}>
            Así viene tu semana · {today.charAt(0).toUpperCase() + today.slice(1)}
          </p>
        </div>
        <div className="page-actions">
          <Link to="/app/tareas/nueva" className="btn btn--dark">
            <PlusIcon size={16} aria-hidden="true" />
            Nueva tarea
          </Link>
        </div>
      </header>

      <section className="load-hero" aria-labelledby="load-title">
        <div>
          <p className="load-hero__label">Tu carga esta semana</p>
          <h2 id="load-title" className="load-hero__state">
            {load.hours === 0 ? 'Sin horas cargadas' : status.label}
          </h2>
          <p className="load-hero__text">
            {load.hours === 0 ?
            'Cuando crees tareas con horas estimadas, acá vas a ver cómo viene tu semana.' :
            loadMessages[status.tone]}
          </p>
        </div>
        <div>
          <div className="load-bar" role="img" aria-label={`${load.percent}% de tu semana asignada`}>
            {LOAD_SEGMENTS.map((color, i) =>
            <span key={i} className="load-bar__segment" style={{ background: color }} />
            )}
          </div>
          <div className="load-bar__labels">
            <span>Liviana</span>
            <span className="load-bar__current">{load.percent}% asignado</span>
            <span>Intensa</span>
          </div>
        </div>
        <div className="load-hero__time">
          <p className="load-hero__hours">{load.available}h</p>
          <p className="load-hero__of">de {load.total}h disponibles</p>
        </div>
      </section>

      <div className="dash-grid">
        <div className="dash-col">
          <section className="card card--grow" aria-labelledby="today-title">
            <div className="card__head">
              <h2 id="today-title" className="card__title">
                Tus próximas tareas
              </h2>
              {tasks.length > 0 &&
              <Link to="/app/tareas" className="link-accent">
                  Ver todas
                </Link>
              }
            </div>
            {upcoming.length === 0 ?
            <EmptyState
              compact
              icon={ListChecksIcon}
              title={tasks.length ? 'No tenés tareas pendientes' : 'Todavía no tenés tareas'}
              text="Creá una tarea para organizar tu semana.">
              
                <Link to="/app/tareas/nueva" className="btn btn--accent btn--sm">
                  <PlusIcon size={14} aria-hidden="true" />
                  Crear tarea
                </Link>
              </EmptyState> :

            <ul className="today-list">
                {upcoming.map((task) =>
              <li key={task.id} className="today-item">
                    <button
                  type="button"
                  className="today-check"
                  onClick={() => updateTask(task.id, { completed: true })}
                  aria-label={`Marcar "${task.title}" como completada`}>
                  
                      <CheckIcon size={11} strokeWidth={3} aria-hidden="true" style={{ opacity: 0 }} />
                    </button>
                    <div className="today-item__body">
                      <Link to={`/app/tareas/${task.id}`} className="today-item__title">
                        {task.title}
                      </Link>
                      <p className="today-item__meta">
                        {task.project} · {task.dueLabel}
                      </p>
                    </div>
                  </li>
              )}
              </ul>
            }
          </section>

          <section className="focus-card" aria-labelledby="focus-title">
            <div className="focus-card__icon">
              <TargetIcon size={22} aria-hidden="true" />
            </div>
            <div className="focus-card__body">
              <p className="focus-card__label">Progreso</p>
              <h2 id="focus-title" className="focus-card__title">
                Tareas completadas
              </h2>
              <p className="focus-card__meta">
                {done} de {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
              </p>
            </div>
            <p className="focus-card__percent">{progress}%</p>
          </section>
        </div>

        <div className="dash-col">
          <section className="card" aria-labelledby="agenda-title">
            <div className="card__head">
              <h2 id="agenda-title" className="card__title">
                Próximo vencimiento
              </h2>
              <Link to="/app/calendario" className="link-accent">
                Calendario
              </Link>
            </div>
            {nextDue ?
            <div className="agenda">
                <div className="agenda__time">
                  <p className="agenda__hour">{format(new Date(nextDue.dueAt), 'HH:mm')}</p>
                  <p className="agenda__duration">{format(new Date(nextDue.dueAt), 'd MMM', { locale: es })}</p>
                </div>
                <div>
                  <p className="agenda__title">{nextDue.title}</p>
                  <p className="agenda__team">{nextDue.project}</p>
                </div>
              </div> :

            <EmptyState
              compact
              icon={CalendarClockIcon}
              title="Sin vencimientos"
              text="Las tareas con fecha van a aparecer acá." />

            }
          </section>

          <section className="card" aria-labelledby="pulse-title">
            <h2 id="pulse-title" className="card__title" style={{ marginBottom: 16 }}>
              Tu pulso esta semana
            </h2>
            <div className="pulse">
              {PULSE.map((item) =>
              <button
                key={item.label}
                type="button"
                className={`pulse__tile pulse__tile--${item.tone}`}
                onClick={() => cyclePulse(item)}
                aria-label={`${item.label}: ${pulse[item.label] ?? 'sin registrar'}. Tocá para cambiar.`}
                style={{ border: 0, cursor: 'pointer', font: 'inherit' }}>
                
                  <p className="pulse__value">{pulse[item.label] ?? '—'}</p>
                  <p className="pulse__label">{item.label}</p>
                </button>
              )}
            </div>
            <p className="pulse__insight">Tocá cada casilla para registrar cómo te sentís.</p>
          </section>

          <Link to="/app/reconocimientos" className="kudos">
            <p className="kudos__label">
              <SparklesIcon size={14} aria-hidden="true" />
              Reconocimientos
            </p>
            <p className="kudos__quote">Todavía no recibiste reconocimientos</p>
            <p className="kudos__from">Empezá vos: reconocé a alguien de tu equipo →</p>
          </Link>
        </div>
      </div>
    </>);

}