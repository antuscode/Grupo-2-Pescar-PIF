// Título de la pestaña según la dirección. La primera regla que coincide es la que vale.
const rules = [
[/^\/$/, 'Te damos la bienvenida'],
[/^\/perfil$/, 'Elegir perfil'],
[/^\/ingresar\/[^/]+$/, 'Iniciar sesión'],
[/^\/ingresar\/[^/]+\/crear-cuenta$/, 'Crear cuenta'],
[/^\/ingresar\/[^/]+\/recuperar$/, 'Recuperar contraseña'],
[/^\/ingresar\/[^/]+\/bienvenida$/, 'Bienvenida'],

[/^\/app$/, 'Inicio y mi carga'],
[/^\/app\/tareas$/, 'Mis tareas'],
[/^\/app\/tareas\/nueva$/, 'Nueva tarea'],
[/^\/app\/tareas\/[^/]+$/, 'Detalle de la tarea'],
[/^\/app\/calendario$/, 'Calendario'],
[/^\/app\/reconocimientos$/, 'Reconocimientos'],
[/^\/app\/logros$/, 'Puntos e insignias'],
[/^\/app\/lumi$/, 'Lumi'],
[/^\/app\/perfil$/, 'Perfil y configuración'],
[/^\/app\/perfil\/email$/, 'Cambiar correo'],

[/^\/equipo$/, 'Dashboard del equipo'],
[/^\/equipo\/proyectos$/, 'Proyectos'],
[/^\/equipo\/tareas$/, 'Tareas del equipo'],
[/^\/equipo\/alertas$/, 'Alertas'],
[/^\/equipo\/reportes$/, 'Reportes'],
[/^\/equipo\/lumi$/, 'Lumi'],
[/^\/equipo\/perfil$/, 'Perfil y configuración'],
[/^\/equipo\/perfil\/suscripcion$/, 'Suscripción']];

export function titleFor(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const match = rules.find(([pattern]) => pattern.test(path));
  return match ? `${match[1]} · Lumora` : 'Lumora';
}
