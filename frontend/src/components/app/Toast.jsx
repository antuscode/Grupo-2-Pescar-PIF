import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CircleCheckIcon, XIcon } from 'lucide-react';

// Aviso flotante arriba al centro que se cierra solo a los 5 segundos
export function Toast({ toast, onClose }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast &&
      <motion.div
        className="toast"
        role="status"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
        
          <CircleCheckIcon size={20} aria-hidden="true" />
          <div className="toast__body">
            <p className="toast__title">{toast.title}</p>
            <p className="toast__text">{toast.text}</p>
          </div>
          <button type="button" className="toast__close" onClick={onClose} aria-label="Cerrar aviso">
            <XIcon size={14} aria-hidden="true" />
          </button>
        </motion.div>
      }
    </AnimatePresence>);

}