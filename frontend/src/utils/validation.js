const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

// Devuelve un mensaje de error, o undefined si el correo es válido.
export function validateEmail(email) {
  if (!email.trim()) return 'Ingresá tu correo electrónico.';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Revisá el formato del correo.';
  return undefined;
}