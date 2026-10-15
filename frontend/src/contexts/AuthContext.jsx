import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

// El front usa 'empleado' | 'manager' en las rutas; la base usa 'employee' | 'manager'.
const ROLE_TO_DB = { empleado: 'employee', manager: 'manager' };
export const roleFromDb = (dbRole) => (dbRole === 'manager' ? 'manager' : 'empleado');
export const homeFor = (frontRole) => (frontRole === 'manager' ? '/equipo' : '/app');

// Traduce los errores de Supabase a mensajes para la persona
function friendlyError(error) {
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('invalid login')) return 'El correo electrónico o la contraseña no son válidos.';
  if (msg.includes('already registered') || msg.includes('already been registered'))
    return 'Ya existe una cuenta con ese correo.';
  if (msg.includes('email not confirmed')) return 'Primero confirmá tu correo desde el enlace que te enviamos.';
  if (msg.includes('rate limit') || msg.includes('too many'))
    return 'Hiciste muchos intentos. Esperá unos minutos y probá de nuevo.';
  if (msg.includes('password')) return 'La contraseña no cumple los requisitos.';
  return 'Algo salió mal. Probá de nuevo en un momento.';
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // 1) Sesión: se restaura al recargar y se mantiene sincronizada
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // 2) Perfil: se carga cuando cambia la persona logueada
  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    setProfileLoading(true);
    supabase.
    from('profiles').
    select('id, full_name, email, role, team_id').
    eq('id', userId).
    single().
    then(({ data }) => {
      if (cancelled) return;
      setProfile(data ?? null);
      setProfileLoading(false);
    });
    return () => {cancelled = true;};
  }, [userId]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: friendlyError(error) };
    // Se trae el perfil acá mismo para que Login pueda validar el rol antes de entrar
    const { data: prof } = await supabase.
    from('profiles').select('role').eq('id', data.user.id).single();
    return { profile: prof };
  }, []);

  const signUp = useCallback(async ({ name, email, password, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role: ROLE_TO_DB[role] ?? 'employee' } }
    });
    if (error) return { error: friendlyError(error) };
    // Si el email ya existía, Supabase no da error (por seguridad) pero devuelve identities vacías
    if (data.user && data.user.identities?.length === 0) {
      return { error: 'Ya existe una cuenta con ese correo.' };
    }
    // Sin sesión = el proyecto exige confirmar el email antes de entrar
    return { needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(() => supabase.auth.signOut(), []);

  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}restablecer`
    });
    return { error: error ? friendlyError(error) : null };
  }, []);

  const updatePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error ? friendlyError(error) : null };
  }, []);

  const value = useMemo(() => ({
    session,
    profile,
    role: profile ? roleFromDb(profile.role) : null,
    loading: sessionLoading || (Boolean(session) && profileLoading),
    signIn, signUp, signOut, resetPassword, updatePassword
  }), [session, profile, sessionLoading, profileLoading, signIn, signUp, signOut, resetPassword, updatePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
