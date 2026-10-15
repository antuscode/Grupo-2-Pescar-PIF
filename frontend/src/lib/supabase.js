import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Falla fuerte y claro en desarrollo si falta el .env
  throw new Error('Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY en el archivo .env');
}

// La anon key es pública por diseño: la seguridad real la dan las políticas RLS de la base.
export const supabase = createClient(url, anonKey);
