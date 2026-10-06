import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addDays, addWeeks, format, isSameDay, isToday, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import './calendar.css';

// Color del punto según la prioridad de la tarea
const LEGEND = [
{ id: 'Alta', label: 'Prioridad alta', color: '#E8746A' },
{ id: 'Media', label: 'Prioridad media', color: '#F2C66D' },
{ id: 'Baja', label: 'Prioridad baja', color: '#4DBB8F' }];

const colorOf = (priority) => LEGEND.find((l) => l.id === priority)?.color;

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Muestra los vencimientos de tus tareas, semana por semana
export function Calendar() {
  const { tasks } = useAppData();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState(() => new Date());

  const weekStart = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const withDate = tasks.filter((t) => t.dueAt && !t.completed);
  const eventsOf = (day) =>
  withDate.
  filter((t) => isSameDay(new Date(t.dueAt), day)).
  sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));

  const selectedEvents = eventsOf(selected);
  const selectedLabel = isToday(selected) ?
  `Hoy, ${format(selected, "d 'de' MMMM", { locale: es })}` :
  capitalize(format(selected, "EEEE, d 'de' MMMM", { locale: es }));

  const changeWeek = (step) => {
    const next = weekOffset + step;
    setWeekOffset(next);
    setSelected(next === 0 ? new Date() : addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), next));
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Calendario</h1>
          <p className="page-subtitle">{capitalize(format(weekStart, 'MMMM yyyy', { locale: es }))}</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn--ghost btn--icon" aria-label="Semana anterior" onClick={() => changeWeek(-1)}>
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </button>
          {weekOffset !== 0 &&
          <button type="button" className="btn btn--ghost" onClick={() => changeWeek(-weekOffset)}>
              Hoy
            </button>
          }
          <button type="button" className="btn btn--ghost btn--icon" aria-label="Semana siguiente" onClick={() => changeWeek(1)}>
            <ChevronRightIcon size={16} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="calendar-layout">
        <section className="card" aria-label="Semana">
          <div className="week">
            {days.map((day) => {
              const events = eventsOf(day);
              const isSelected = isSameDay(day, selected);
              let className = 'week__day';
              if (isToday(day)) className += ' week__day--today';
              if (isSelected) className += ' week__day--selected';
              return (
                <div key={day.toISOString()}>
                  <p className="week__name">{capitalize(format(day, 'EEE', { locale: es }).replace('.', ''))}</p>
                  <button
                    type="button"
                    className={className}
                    aria-pressed={isSelected}
                    aria-label={`${format(day, "EEEE d 'de' MMMM", { locale: es })}, ${events.length} vencimientos`}
                    onClick={() => setSelected(day)}>
                    
                    {format(day, 'd')}
                    <span className="week__dots" aria-hidden="true">
                      {events.slice(0, 3).map((t) =>
                      <span key={t.id} className="week__dot" style={{ background: colorOf(t.priority) }} />
                      )}
                    </span>
                  </button>
                </div>);

            })}
          </div>
          <div className="legend">
            {LEGEND.map((l) =>
            <span key={l.id} className="legend__item">
                <span className="week__dot" style={{ background: l.color }} aria-hidden="true" />
                {l.label}
              </span>
            )}
          </div>
        </section>

        <section className="card" aria-labelledby="day-title">
          <h2 id="day-title" className="card__title" style={{ marginBottom: 8 }}>
            {selectedLabel}
          </h2>
          {selectedEvents.length === 0 ?
          <p className="agenda-empty">
              {withDate.length === 0 ?
            'Todavía no tenés tareas con fecha. Al crear una tarea, elegí su vencimiento y aparece acá.' :
            'No tenés vencimientos este día.'}
            </p> :

          <ul className="agenda-list">
              {selectedEvents.map((t) =>
            <li key={t.id} className="agenda-item">
                  <span className="agenda-item__time">{format(new Date(t.dueAt), 'HH:mm')}</span>
                  <Link
                to={`/app/tareas/${t.id}`}
                className="agenda-item__title"
                style={{ borderColor: colorOf(t.priority), color: 'inherit', textDecoration: 'none' }}>
                
                    {t.title}
                  </Link>
                </li>
            )}
            </ul>
          }
        </section>
      </div>
    </>);

}