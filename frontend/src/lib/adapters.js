import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Fecha de la base (AAAA-MM-DD) → texto corto, ej. "12 oct".
// Se usa parseISO porque new Date('2026-10-12') la tomaría como UTC
// y en Argentina mostraría el día anterior.
export const formatShortDate = (value) =>
  value ? format(parseISO(value), 'dd MMM', { locale: es }) : 'Sin fecha';

// Fila de team_members → integrante del front
export const toFrontMember = (row) => ({
  id: row.id,
  name: row.name,
  role: row.job_title,
  email: row.email ?? '',
  color: row.color,
  userId: row.user_id,
  tasks: []
});

// Fila de projects (con project_members) → proyecto del front
export const toFrontProject = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  due: formatShortDate(row.due_date),
  memberIds: (row.project_members ?? []).map((pm) => pm.member_id)
});