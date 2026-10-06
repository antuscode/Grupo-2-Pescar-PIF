import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon, SparkleIcon, XIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { lumiProfile } from '../../utils/lumiProfiles';

// Botón redondo de Lumi disponible en todas las pantallas (empleado y líder)
// variant: 'employee' | 'manager'
export function FloatingLumi({ variant = 'employee' }) {
  const { user } = useAppData();
  const profile = lumiProfile(variant);
  const firstName = user.firstName;
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  if (location.pathname === profile.path) return null;

  const ask = (prompt) => navigate(profile.path, { state: { prompt } });

  return (
    <div className="floating-lumi">
      <AnimatePresence>
        {open &&
        <motion.div
          id="floating-lumi-panel"
          className="floating-lumi__panel"
          role="dialog"
          aria-label="Lumi"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
          
            <div className="floating-lumi__head">
              <span className="floating-lumi__avatar" aria-hidden="true" />
              <div>
                <p className="floating-lumi__name">Lumi</p>
                <p className="floating-lumi__status">En línea</p>
              </div>
            </div>
            <p className="floating-lumi__greeting">Hola, {firstName}. ¿En qué te ayudo?</p>
            <div className="floating-lumi__prompts">
              {profile.quickPrompts.map((p) =>
            <button key={p.id} type="button" className="floating-lumi__prompt" onClick={() => ask(p.prompt)}>
                  <SparkleIcon size={12} aria-hidden="true" />
                  {p.label}
                </button>
            )}
            </div>
            <button type="button" className="floating-lumi__open" onClick={() => navigate(profile.path)}>
              Abrir chat completo
              <ArrowRightIcon size={14} aria-hidden="true" />
            </button>
          </motion.div>
        }
      </AnimatePresence>

      <button
        type="button"
        className="floating-lumi__button"
        aria-label={open ? 'Cerrar Lumi' : 'Abrir Lumi'}
        aria-expanded={open}
        aria-controls="floating-lumi-panel"
        onClick={() => setOpen(!open)}>
        
        {open ? <XIcon size={20} aria-hidden="true" /> : <span className="floating-lumi__avatar" aria-hidden="true" />}
      </button>
    </div>);

}