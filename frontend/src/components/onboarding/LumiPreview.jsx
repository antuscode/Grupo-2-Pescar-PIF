import React from 'react';
import { SendIcon, SparkleIcon, SparklesIcon } from 'lucide-react';

// Paso 3: conversación de ejemplo con Lumi
export function LumiPreview() {
  return (
    <div className="onb-preview" aria-hidden="true">
      <div className="onb-card onb-chat">
        <div className="onb-chat__head">
          <span className="onb-chat__avatar" />
          <div>
            <p className="onb-chat__name">Lumi</p>
            <p className="onb-chat__status">En línea</p>
          </div>
          <SparkleIcon size={22} className="onb-chat__spark" />
        </div>

        <div className="onb-chat__body">
          <p className="onb-bubble-user">¿Cómo viene mi semana?</p>
          <div className="onb-bubble-row">
            <span className="onb-chat__avatar onb-chat__avatar--sm" />
            <div className="onb-bubble-bot">
              ¡Hola, Valentina! Tu carga está en equilibrio. Podés empezar por tu próxima prioridad:
              <div className="onb-card">
                <p className="onb-task__title" style={{ marginTop: 0 }}>
                  Ajustar flujo de onboarding
                </p>
                <p className="onb-task__meta">Lumora App · Hoy, 11:30</p>
              </div>
              Después tenés la revisión de prototipo con Desarrollo a las 14:00.
            </div>
          </div>
        </div>

        <div className="onb-chat__input">
          Escribí a Lumi...
          <span className="onb-chat__send">
            <SendIcon size={14} />
          </span>
        </div>
      </div>

      <p className="onb-suggestion">
        <SparklesIcon size={14} />
        ¿Cómo puedo equilibrar la carga del equipo?
      </p>
      <p className="onb-preview__caption">Conversación de ejemplo · Lumi te acompaña dentro de Lumora.</p>
    </div>);

}