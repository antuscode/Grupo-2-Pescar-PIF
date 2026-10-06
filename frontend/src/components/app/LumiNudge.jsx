import React from 'react';
import { useNavigate } from 'react-router-dom';

// Mensaje flotante de Lumi. Si no recibe onClick, lleva al chat de Lumi.
export function LumiNudge({ children, onClick }) {
  const navigate = useNavigate();
  return (
    <button type="button" className="lumi-nudge" onClick={onClick ?? (() => navigate('/app/lumi'))}>
      <span className="lumi-dot" aria-hidden="true" />
      <span>{children}</span>
    </button>);

}