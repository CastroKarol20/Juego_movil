const { LEVELS } = require('../utils/constants');
const { calculateStreak, calculateAccuracy } = require('../utils/helpers');

// Procesar XP y verificar si sube de nivel
const processXP = (user, xpToAdd) => {
  user.currentXP += xpToAdd;

  let leveledUp = false;
  let levelsGained = 0;

  while (user.currentXP >= LEVELS.XP_PER_LEVEL && user.level < LEVELS.MAX_LEVEL) {
    user.currentXP -= LEVELS.XP_PER_LEVEL;
    user.level += 1;
    leveledUp = true;
    levelsGained += 1;
  }

  return { leveledUp, levelsGained, newLevel: user.level };
};

// Actualizar racha diaria
const processStreak = (user) => {
  const newStreak = calculateStreak(user.lastPlayedDate, user.streak);
  user.streak = newStreak;
  user.lastPlayedDate = new Date();
  return newStreak;
};

// Actualizar estadísticas después de una partida
const updateStats = (user, { isCorrect, timeSpent, isPerfect }) => {
  user.stats.gamesPlayed += 1;

  if (isCorrect) {
    user.stats.gamesWon += 1;
    user.stats.consecutiveWins += 1;
    if (isPerfect) user.stats.perfectGames += 1;
  } else {
    user.stats.gamesLost += 1;
    user.stats.consecutiveWins = 0;
  }

  user.stats.totalTimeSpent += timeSpent;
  user.stats.averageAccuracy = calculateAccuracy(
    user.stats.gamesWon,
    user.stats.gamesPlayed
  );

  return user.stats;
};

module.exports = { processXP, processStreak, updateStats };