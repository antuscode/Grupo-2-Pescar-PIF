import { lastLoginLabel } from './user';

// Sesión guardada en el navegador. Cuando exista el backend, acá se guardará
// el token y el usuario se pedirá al servidor; el resto de la app no cambia.
const KEY = 'lumora-session';

export function loadSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user || !user.name || !user.roleId) return null;
    return { ...user, lastLogin: lastLoginLabel(user.loggedInAt) };
  } catch {
    return null;
  }
}

export function saveSession(user) {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    // Sin almacenamiento disponible (modo privado, cuota): la sesión dura hasta recargar.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nada que borrar
  }
}
