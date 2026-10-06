import React from 'react';
import { AwardIcon, CalendarIcon } from 'lucide-react';

const WEEK = [
{ name: 'Lun', day: 21, active: true },
{ name: 'Mar', day: 22 },
{ name: 'Mié', day: 23 },
{ name: 'Jue', day: 24 },
{ name: 'Vie', day: 25 }];


const LOADS = [
{ name: 'Camila R.', percent: 60, color: '#3FAE86', status: 'Equilibrada', statusColor: '#22693f' },
{ name: 'Sofía L.', percent: 95, color: '#E8746A', status: 'Atención', statusColor: '#b42323' }];


// Paso 2: vista de ejemplo de las herramientas
export function ClarityPreview() {
  return (
    <div className="onb-preview" aria-hidden="true">
      <div className="onb-card">
        <div className="onb-week-head">
          Tu día, organizado
          <CalendarIcon size={16} />
        </div>
        <div className="onb-week">
          {WEEK.map((d) =>
          <div key={d.day} className={d.active ? 'onb-day onb-day--active' : 'onb-day'}>
              <p className="onb-day__name">{d.name}</p>
              <p className="onb-day__number">{d.day}</p>
            </div>
          )}
        </div>
        <div className="onb-row">
          <span className="onb-task__circle" />
          Ajustar flujo de onboarding
          <span className="onb-row__time">11:30</span>
        </div>
      </div>

      <div className="onb-card">
        <p className="onb-week-head">Carga por integrante</p>
        {LOADS.map((l) =>
        <div key={l.name} className="onb-load">
            <span className="onb-load__name">{l.name}</span>
            <span className="onb-load__track">
              <span className="onb-load__fill" style={{ display: 'block', width: `${l.percent}%`, background: l.color }} />
            </span>
            <span className="onb-load__status" style={{ color: l.statusColor }}>
              {l.status}
            </span>
          </div>
        )}
        <p className="onb-hint">Sofía L. · Es un buen momento para revisar su carga.</p>
      </div>

      <div className="onb-card onb-card--navy">
        <span className="onb-quote-icon onb-quote-icon--round">
          <AwardIcon size={18} />
        </span>
        <div>
          <p className="onb-quote__tag">Colaboración</p>
          <p className="onb-quote__text" style={{ marginTop: 4 }}>
            Diego M. — Gracias por bancar el deploy de anoche.
          </p>
          <p className="onb-quote__meta">Reconocimientos · Puntos e insignias</p>
        </div>
      </div>

      <p className="onb-preview__caption">Una vista de ejemplo de las herramientas que te acompañan.</p>
    </div>);

}