import {
  AwardIcon,
  BellIcon,
  CalendarIcon,
  FolderIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  ListChecksIcon,
  MessageCircleIcon,
  SettingsIcon,
  SquareCheckIcon,
  TrendingUpIcon } from
'lucide-react';

export const employeeNav = [
{
  section: null,
  items: [
  { to: '/app', label: 'Inicio y mi carga', icon: LayoutGridIcon, end: true },
  { to: '/app/tareas', label: 'Mis tareas', icon: SquareCheckIcon },
  { to: '/app/calendario', label: 'Calendario', icon: CalendarIcon }]

},
{
  section: 'Comunidad',
  items: [
  { to: '/app/reconocimientos', label: 'Reconocimientos', icon: HeartIcon },
  { to: '/app/logros', label: 'Puntos e insignias', icon: AwardIcon }]

},
{
  section: 'Asistente',
  items: [{ to: '/app/lumi', label: 'Lumi', icon: MessageCircleIcon }]
},
{
  section: null,
  items: [{ to: '/app/perfil', label: 'Perfil y configuración', icon: SettingsIcon }]
}];


export const managerNav = [
{
  section: null,
  items: [
  { to: '/equipo', label: 'Dashboard del equipo', icon: LayoutDashboardIcon, end: true },
  { to: '/equipo/proyectos', label: 'Proyectos', icon: FolderIcon },
  { to: '/equipo/tareas', label: 'Tareas', icon: ListChecksIcon }]

},
{
  section: 'Bienestar',
  items: [
  { to: '/equipo/alertas', label: 'Alertas', icon: BellIcon },
  { to: '/equipo/reportes', label: 'Reportes', icon: TrendingUpIcon }]

},
{
  section: 'Asistente',
  items: [{ to: '/equipo/lumi', label: 'Lumi', icon: MessageCircleIcon }]
},
{
  section: null,
  items: [{ to: '/equipo/perfil', label: 'Perfil y configuración', icon: SettingsIcon }]
}];


// Títulos de las secciones que todavía no tienen diseño
export const comingSoonTitles = {
  calendario: 'Calendario',
  lumi: 'Lumi',
  tareas: 'Tareas',
  alertas: 'Alertas',
  reconocimientos: 'Reconocimientos',
  reportes: 'Reportes'
};