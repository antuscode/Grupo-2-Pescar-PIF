import {
  badges,
  POINTS_PER_LEVEL,
  POINTS_PER_RECOGNITION,
  POINTS_PER_TASK,
  trophy } from
'../data/achievements';

// Calcula puntos, nivel e insignias a partir de lo que la persona hizo en la app
export function computeAchievements(tasks, recognitions) {
  const doneTasks = tasks.filter((t) => t.completed);
  const counts = { tasks: doneTasks.length, recognitions: recognitions.length };

  const points = counts.tasks * POINTS_PER_TASK + counts.recognitions * POINTS_PER_RECOGNITION;
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
  const intoLevel = points % POINTS_PER_LEVEL;

  const withStatus = (item, earned, progressText) => ({
    ...item,
    earned,
    date: earned ? 'Obtenida' : progressText
  });

  const badgeList = badges.map((badge) => {
    const current = Math.min(counts[badge.rule.type], badge.rule.count);
    return withStatus(badge, current >= badge.rule.count, `Progreso: ${current} de ${badge.rule.count}`);
  });

  const trophyStatus = withStatus(trophy, level >= trophy.level, `Estás en el Nivel ${level} de ${trophy.level}`);

  // Historial: lo más reciente primero
  const history = [
  ...recognitions.map((r) => ({ id: r.id, text: `Reconociste a ${r.person}`, points: `+${POINTS_PER_RECOGNITION}` })),
  ...doneTasks.map((t) => ({ id: t.id, text: `Completaste “${t.title}”`, points: `+${POINTS_PER_TASK}` }))];


  return {
    summary: {
      points,
      level,
      missing: POINTS_PER_LEVEL - intoLevel,
      nextTitle: `Nivel ${level + 1}`,
      progress: Math.round(intoLevel / POINTS_PER_LEVEL * 100)
    },
    badges: badgeList,
    trophy: trophyStatus,
    history
  };
}