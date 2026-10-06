// Puntos que suma cada acción
export const POINTS_PER_TASK = 10;
export const POINTS_PER_RECOGNITION = 15;
export const POINTS_PER_LEVEL = 100;

// Trofeo principal: se obtiene al llegar a este nivel
export const trophy = {
  id: 'guardian',
  name: 'Guardián del equilibrio',
  description: 'Llegá al Nivel 4 sumando puntos con tus tareas y reconocimientos.',
  icon: 'trophy',
  level: 4,
  highlight: true
};

// Insignias. "rule" indica qué hay que hacer para obtenerla.
export const badges = [
{
  id: 'primer-paso',
  name: 'Primer paso',
  caption: 'Primer logro',
  description: 'Completá tu primera tarea en Lumora.',
  icon: 'sprout',
  rule: { type: 'tasks', count: 1 }
},
{
  id: 'colaboracion',
  name: 'Colaboración',
  caption: 'Apoyo grupal',
  description: 'Reconocé el trabajo de 5 compañeros.',
  icon: 'handshake',
  rule: { type: 'recognitions', count: 5 }
},
{
  id: 'constancia',
  name: 'Constancia',
  caption: '10 tareas',
  description: 'Completá 10 tareas.',
  icon: 'trophy',
  rule: { type: 'tasks', count: 10 }
}];