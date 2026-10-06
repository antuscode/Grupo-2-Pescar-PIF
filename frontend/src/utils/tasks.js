import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { WEEKLY_HOURS } from '../data/team';

// Color de la etiqueta según prioridad o estado
export const priorityTone = { Alta: 'red', Media: 'amber', Baja: 'green' };
export const statusTone = {
  'En progreso': 'blue',
  Pendiente: 'amber',
  'En revisión': 'purple',
  Completada: 'green'
};

// Convierte el valor de un <input type="datetime-local"> en un texto corto.
// dueAt guarda la fecha completa para ordenarla y mostrarla en el calendario.
export function formatDue(value) {
  if (!value) return { dueLabel: 'Sin fecha', dueSoon: false, dueAt: null };
  const date = new Date(value);
  const dueAt = date.toISOString();
  if (isToday(date)) return { dueLabel: `Hoy, ${format(date, 'HH:mm')}`, dueSoon: true, dueAt };
  return { dueLabel: format(date, 'd MMM, HH:mm', { locale: es }), dueSoon: false, dueAt };
}

// Estado de carga de una persona según el porcentaje de horas asignadas
export function loadStatus(percent) {
  if (percent > 90) return { label: 'Atención', tone: 'red' };
  if (percent > 75) return { label: 'Carga alta', tone: 'amber' };
  return { label: 'Equilibrada', tone: 'green' };
}

// Carga semanal de una lista de tareas activas (horas estimadas sobre 40h)
export function weeklyLoad(tasks) {
  const hours = tasks.filter((t) => !t.completed).reduce((sum, t) => sum + (t.hours || 0), 0);
  const percent = Math.round(hours / WEEKLY_HOURS * 100);
  return { hours, percent, available: Math.max(WEEKLY_HOURS - hours, 0), total: WEEKLY_HOURS };
}