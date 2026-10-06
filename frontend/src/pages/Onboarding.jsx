import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ActivityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  CalendarCheckIcon,
  SparkleIcon } from
'lucide-react';
import { BalancePreview } from '../components/onboarding/BalancePreview';
import { ClarityPreview } from '../components/onboarding/ClarityPreview';
import { LumiPreview } from '../components/onboarding/LumiPreview';
import { TopBar } from '../components/TopBar';
import './onboarding.css';

const ROLE_SELECT = '/perfil';
const TOTAL_STEPS = 3;

const FEATURES = [
{ icon: CalendarCheckIcon, title: 'Organizá tu día', text: 'Tus tareas, prioridades y calendario, en un mismo lugar.' },
{ icon: ActivityIcon, title: 'Encontrá el equilibrio', text: 'Visualizá la carga laboral y detectá señales de sobrecarga.' },
{ icon: AwardIcon, title: 'Valorá a tu equipo', text: 'Reconocimientos, puntos e insignias para valorar lo que aportan.' }];


export function Onboarding() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  const isLast = step === TOTAL_STEPS - 1;
  const next = () => isLast ? navigate(ROLE_SELECT) : setStep(step + 1);

  return (
    <div className="onboarding">
      <TopBar showTagline>
        <Link to={ROLE_SELECT} className="topbar__link">
          Iniciar sesión
        </Link>
      </TopBar>

      <main className="onb-main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={step}
            className="onb-step"
            aria-live="polite"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
            
            {step === 0 &&
            <>
                <div>
                  <p className="onb-eyebrow">Te damos la bienvenida</p>
                  <h1 className="onb-title">
                    Tu trabajo,
                    <br />
                    en equilibrio.
                  </h1>
                  <p className="onb-lead">
                    Organizá tus tareas, cuidá tu energía y conectá con tu equipo. Todo en un mismo lugar.
                  </p>
                  <p className="onb-note">
                    <SparkleIcon size={16} aria-hidden="true" />
                    Un espacio para avanzar y cuidarte.
                  </p>
                </div>
                <BalancePreview />
              </>
            }

            {step === 1 &&
            <>
                <div>
                  <p className="onb-eyebrow">Un día con más claridad</p>
                  <h1 className="onb-title onb-title--md">
                    Más claridad para tu día. Más cuidado para tu equipo.
                  </h1>
                  <div className="onb-features">
                    {FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.title} className="onb-feature">
                          <span className="onb-feature__icon" aria-hidden="true">
                            <Icon size={16} />
                          </span>
                          <div>
                            <p className="onb-feature__title">{f.title}</p>
                            <p className="onb-feature__text">{f.text}</p>
                          </div>
                        </div>);

                  })}
                  </div>
                </div>
                <ClarityPreview />
              </>
            }

            {step === 2 &&
            <>
                <div>
                  <p className="onb-eyebrow">Un poco de ayuda, cada día</p>
                  <h1 className="onb-title">Conocé a Lumi.</h1>
                  <p className="onb-lead">
                    Tu asistente para revisar prioridades, consultar la carga del equipo y encontrar ideas para
                    reconocer a otros.
                  </p>
                  <div className="onb-tags">
                    <span className="onb-tag">Prioridades</span>
                    <span className="onb-tag">Carga del equipo</span>
                    <span className="onb-tag">Reconocimientos</span>
                  </div>
                </div>
                <LumiPreview />
              </>
            }
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="onb-footer">
        <Link to={ROLE_SELECT} className="onb-skip">
          Omitir introducción
        </Link>

        <div className="onb-progress">
          <span>
            Paso {step + 1} de {TOTAL_STEPS}
          </span>
          <div className="onb-dots" aria-hidden="true">
            {Array.from({ length: TOTAL_STEPS }, (_, i) =>
            <span key={i} className={i === step ? 'onb-dot onb-dot--active' : 'onb-dot'} />
            )}
          </div>
        </div>

        <div className="onb-nav">
          <div className="onb-nav__buttons">
            {step > 0 &&
            <button type="button" className="onb-back" onClick={() => setStep(step - 1)}>
                <ArrowLeftIcon size={16} aria-hidden="true" />
                Atrás
              </button>
            }
            <button type="button" className="onb-next" onClick={next}>
              {isLast ? 'Comenzar' : 'Siguiente'}
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="onb-nav__hint">
            {isLast ? 'A continuación, elegí tu rol para continuar.' : 'Conocé Lumora antes de elegir tu rol.'}
          </p>
        </div>
      </footer>
    </div>);

}