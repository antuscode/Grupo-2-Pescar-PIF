// Genera un ID único. Sirve hasta que el backend los asigne.
// Reemplaza a `Date.now()`, que repite el valor si se hacen dos acciones en el mismo milisegundo.
export function newId(prefix = '') {
  const unique =
    typeof crypto !== 'undefined' && crypto.randomUUID ?
    crypto.randomUUID() :
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}${unique}`;
}
