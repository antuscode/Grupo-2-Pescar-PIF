import React from 'react';

export const LUMORA_LOGO_URL = "/logo.webp";

export function LumoraLogo({ className = 'brand__logo' }) {
  return <img src={LUMORA_LOGO_URL} alt="Lumora" width={720} height={480} className={className} />;
}