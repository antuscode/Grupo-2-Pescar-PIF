import React from 'react';
import { SparklesIcon } from 'lucide-react';
import '../../pages/employee/dashboard.css';

const SEGMENTS = ['#4DBB8F', '#4DBB8F', '#FFD970', '#FFD970', '#4A5470'];

// Paso 1: ilustración de cómo se ve un día en Lumora (es solo un ejemplo visual)
export function BalancePreview() {
  return (
    <div className="onb-preview" aria-hidden="true">
      <p className="onb-preview__label">Así se ve un día en Lumora</p>

      <div className="onb-card onb-card--dark">
        <p className="onb-card__label">Tu carga laboral hoy</p>
        <p className="onb-card__state">En equilibrio</p>
        <p className="onb-card__text">Tenés margen para avanzar sin sobrecargarte.</p>
        <div className="load-bar">
          {SEGMENTS.map((color, i) =>
          <span key={i} className="load-bar__segment" style={{ background: color }} />
          )}
        </div>
        <div className="load-bar__labels">
          <span>Liviana</span>
          <span className="load-bar__current">68% asignado</span>
          <span>Intensa</span>
        </div>
      </div>

      <div className="onb-card onb-card--offset onb-task">
        <span className="onb-task__circle" />
        <div className="onb-task__body">
          <p className="onb-task__label">Tu próxima tarea</p>
          <p className="onb-task__title">Ajustar flujo de onboarding</p>
          <p className="onb-task__meta">Lumora App · Hoy, 11:30</p>
        </div>
        <span className="onb-task__dot" />
      </div>

      <div className="onb-card onb-card--navy">
        <span className="onb-quote-icon">
          <SparklesIcon size={18} />
        </span>
        <div>
          <p className="onb-quote__text">“Gran mirada para simplificar lo complejo”</p>
          <p className="onb-quote__meta">Reconocimiento reciente</p>
        </div>
      </div>
    </div>);

}