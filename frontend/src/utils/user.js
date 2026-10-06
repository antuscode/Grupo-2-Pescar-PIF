import { format, isToday } from 'date-fns';

// Arma un nombre a partir del email: "ana.perez@empresa.com" → "Ana Perez"
function nameFromEmail(email) {
  const local = (email || '').split('@')[0];
  return local.
  split(/[._-]+/).
  filter(Boolean).
  map((word) => word[0].toUpperCase() + word.slice(1)).
  join(' ');
}

// Texto que se muestra en el perfil: "Sesión actual · hoy, 14:30"
export function lastLoginLabel(isoDate) {
  const date = new Date(isoDate);
  if (isToday(date)) return `Sesión actual · hoy, ${format(date, 'HH:mm')}`;
  return `Sesión iniciada · ${format(date, 'dd/MM')}, ${format(date, 'HH:mm')}`;
}

// Crea los datos de la persona que inició sesión.
// Si no escribió su nombre (por ejemplo, al iniciar sesión), se arma con el email.
// roleId ('employee' | 'manager') es lo que usan las rutas protegidas.
export function buildUser({ name = '', email = '', role = 'employee', loggedInAt = new Date().toISOString() } = {}) {
  const fullName = name.trim() || nameFromEmail(email) || 'Invitado';
  const parts = fullName.split(/\s+/);
  const firstName = parts[0];
  const initials = (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  const shortName = parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
  const roleId = role === 'manager' ? 'manager' : 'employee';

  return {
    firstName,
    name: fullName,
    shortName,
    initials,
    email,
    pendingEmail: null,
    roleId,
    role: roleId === 'manager' ? 'Líder de equipo' : 'Integrante del equipo',
    team: 'Mi equipo',
    passwordUpdated: 'Creada al registrarte',
    loggedInAt,
    lastLogin: lastLoginLabel(loggedInAt)
  };
}
