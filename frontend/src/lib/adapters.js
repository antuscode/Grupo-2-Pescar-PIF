import { format, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatDue } from '../utils/tasks';

// Fecha de la base → texto corto, ej. "12 oct" (parseISO evita el desfase de un día)
export const formatShortDate = (value) =>
  value ? format(parseISO(value), 'dd MMM', { locale: es }) : 'Sin fecha';

// Tarea tal como la ve el líder dentro de cada integrante
export const toLeaderTask = (row) => ({
  id: row.id,
  title: row.title,
  project: row.project?.name ?? 'General',
  hours: Number(row.hours),
  due: formatShortDate(row.due_at)
});

// Integrante: solo cuentan las tareas activas (las completadas no suman carga)
export const toFrontMember = (row) => ({
  id: row.id,
  name: row.name,
  role: row.job_title,
  email: row.email ?? '',
  color: row.color,
  userId: row.user_id,
  tasks: (row.tasks ?? []).filter((t) => t.completed_at === null).map(toLeaderTask)
});

export const toFrontProject = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  due: formatShortDate(row.due_date),
  memberIds: (row.project_members ?? []).map((pm) => pm.member_id)
});

// Tarea tal como la ve el empleado
export const toFrontTask = (row) => ({
  id: row.id,
  title: row.title,
  project: row.project?.name ?? 'General',
  priority: row.priority,
  hours: Number(row.hours),
  ...formatDue(row.due_at),
  status: row.completed_at ? 'Completada' : row.status,
  completed: row.completed_at !== null,
  assignee: row.assignee?.name,
  description: row.description,
  subtasks: [],
  comments: []
});

// Reconocimiento enviado
export const toFrontRecognition = (row) => ({
  id: row.id,
  person: row.to?.name ?? '',
  category: row.category,
  message: row.message,
  time: isToday(parseISO(row.created_at)) ? 'Recién' : formatShortDate(row.created_at)
});