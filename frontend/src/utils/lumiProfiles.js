import {
  lumiFallback,
  lumiQuickPrompts,
  lumiReplies,
  managerLumiFallback,
  managerLumiQuickPrompts,
  managerLumiReplies } from
'../data/lumi';

// Configuración de Lumi según quién la usa
export function lumiProfile(variant) {
  if (variant === 'manager') {
    return {
      path: '/equipo/lumi',
      quickPrompts: managerLumiQuickPrompts,
      replies: managerLumiReplies,
      fallback: managerLumiFallback,
      subtitle: 'Tu asistente para cuidar al equipo',
      emptyText: 'Preguntame por la carga del equipo, cómo redistribuir tareas o qué alertas hay.'
    };
  }
  return {
    path: '/app/lumi',
    quickPrompts: lumiQuickPrompts,
    replies: lumiReplies,
    fallback: lumiFallback,
    subtitle: 'Tu asistente de bienestar',
    emptyText: 'Preguntame por tus prioridades, tu carga de la semana o ideas para reconocer a tu equipo.'
  };
}