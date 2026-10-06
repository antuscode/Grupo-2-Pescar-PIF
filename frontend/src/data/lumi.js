// Preguntas rápidas y respuestas de Lumi.
// Las respuestas usan los datos reales que cargaste en la app (ctx),
// así que cambian a medida que agregás tareas, integrantes o proyectos.

const list = (names) => names.length > 1 ? `${names.slice(0, -1).join(', ')} y ${names.at(-1)}` : names[0];

/* ---------- Empleado ---------- */
export const lumiQuickPrompts = [
{ id: 'priorizar', label: 'Priorizar mi día', prompt: '¿Qué hago primero hoy?' },
{ id: 'resumen', label: 'Resumen semanal', prompt: 'Haceme un resumen de mi semana' },
{ id: 'reconocer', label: 'Enviar un reconocimiento', prompt: '¿A quién podría reconocer esta semana?' }];


// ctx: { tasks, teammates, load }
export const lumiReplies = [
{
  keywords: ['reconoc', 'agradec'],
  reply: ({ teammates }) =>
  teammates.length === 0 ?
  'Todavía no hay compañeros cargados en tu equipo. Cuando tu líder los agregue, te voy a sugerir a quién reconocer.' :
  `Podrías reconocer a ${list(teammates.slice(0, 3))}. Un mensaje concreto sobre cómo te ayudaron suma mucho.`
},
{
  keywords: ['resumen', 'semana'],
  reply: ({ tasks, load }) => {
    if (tasks.length === 0) return 'Todavía no cargaste tareas. Creá la primera desde "Mis tareas" y te armo el resumen.';
    const done = tasks.filter((t) => t.completed).length;
    const active = tasks.length - done;
    return `Completaste ${done} ${done === 1 ? 'tarea' : 'tareas'} y tenés ${active} activas. Tu carga estimada es de ${load.hours}h (${load.percent}% de la semana).`;
  }
},
{
  keywords: ['primero', 'priori', 'hoy'],
  reply: ({ tasks }) => {
    const order = { Alta: 0, Media: 1, Baja: 2 };
    const next = tasks.
    filter((t) => !t.completed).
    sort((a, b) => Number(b.dueSoon) - Number(a.dueSoon) || order[a.priority] - order[b.priority])[0];
    if (!next) return 'No tenés tareas pendientes. Buen momento para planificar o tomarte un respiro.';
    return `Empezá por «${next.title}»: prioridad ${next.priority.toLowerCase()}, vence ${next.dueLabel.toLowerCase()}.`;
  }
},
{
  keywords: ['carga', 'cansad', 'mucho'],
  reply: ({ load }) =>
  load.hours === 0 ?
  'Todavía no hay horas estimadas en tus tareas. Cargalas al crear una tarea y te digo cómo viene tu semana.' :
  `Tenés ${load.hours}h estimadas de ${load.total}h (${load.percent}%). ${load.percent > 75 ? 'Es bastante: podemos ver qué mover.' : 'Estás dentro de una carga sana.'}`
}];


export const lumiFallback =
'Por ahora puedo ayudarte con tus prioridades, tu carga de la semana y reconocimientos para tu equipo.';

/* ---------- Líder ---------- */
export const managerLumiQuickPrompts = [
{ id: 'carga', label: 'Carga del equipo', prompt: '¿Cómo viene la carga del equipo?' },
{ id: 'redistribuir', label: 'Redistribuir tareas', prompt: '¿Qué tarea puedo redistribuir?' },
{ id: 'alertas', label: 'Revisar alertas', prompt: '¿Hay alertas activas?' }];


// ctx: { members, projects, alerts, balanced }
export const managerLumiReplies = [
{
  keywords: ['redistribu', 'reasign', 'sacar', 'mover'],
  reply: ({ members }) => {
    const sorted = [...members].sort((a, b) => b.load - a.load);
    const from = sorted.find((m) => m.tasks.length > 0);
    const to = sorted.at(-1);
    if (!from || !to || from.id === to.id) return 'Necesito al menos dos integrantes con tareas para sugerirte una redistribución.';
    const task = [...from.tasks].sort((a, b) => a.hours - b.hours)[0];
    return `Podés pasar «${task.title}» (${task.hours}h) de ${from.name} (${from.load}%) a ${to.name} (${to.load}%).`;
  }
},
{
  keywords: ['carga', 'equipo', 'semana'],
  reply: ({ members, balanced, alerts }) => {
    if (members.length === 0) return 'Todavía no agregaste integrantes. Sumalos desde el Dashboard del equipo y te cuento cómo viene su carga.';
    const extra = alerts.length ? ` Necesitan atención: ${list(alerts.map((m) => `${m.name} (${m.load}%)`))}.` : '';
    return `${balanced} de ${members.length} personas están en equilibrio.${extra}`;
  }
},
{
  keywords: ['alerta', 'riesgo'],
  reply: ({ alerts }) =>
  alerts.length === 0 ?
  'No hay alertas activas. Nadie supera el 75% de su capacidad.' :
  `Tenés ${alerts.length} ${alerts.length === 1 ? 'alerta activa' : 'alertas activas'}: ${list(alerts.map((m) => m.name))}.`
},
{
  keywords: ['proyecto'],
  reply: ({ projects, members }) => {
    if (projects.length === 0) return 'Todavía no creaste proyectos. Podés hacerlo desde la sección Proyectos.';
    const hoursOf = (p) =>
    members.flatMap((m) => m.tasks).filter((t) => t.project === p.name).reduce((s, t) => s + t.hours, 0);
    const top = [...projects].sort((a, b) => hoursOf(b) - hoursOf(a))[0];
    return `Tenés ${projects.length} ${projects.length === 1 ? 'proyecto' : 'proyectos'}. El que más horas pendientes tiene es «${top.name}» (${hoursOf(top)}h).`;
  }
}];


export const managerLumiFallback =
'Puedo ayudarte con la carga del equipo, redistribuir tareas, revisar alertas y resumir tus proyectos.';