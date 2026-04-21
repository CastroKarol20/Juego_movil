const { LEVELS, BONUS } = require('./constants');

// Calcular XP necesario para el siguiente nivel
const getXPForNextLevel = (level) => {
  return level * LEVELS.XP_PER_LEVEL;
};

// Calcular nivel basado en XP total acumulado
const calculateLevel = (totalXP) => {
  return Math.floor(totalXP / LEVELS.XP_PER_LEVEL) + 1;
};

// Calcular bonus por velocidad
const calculateSpeedBonus = (timeSpent, timeLimit, basePoints) => {
  const threshold = timeLimit * BONUS.SPEED_THRESHOLD;
  if (timeSpent < threshold) {
    return Math.floor(basePoints * BONUS.SPEED_BONUS_PERCENTAGE);
  }
  return 0;
};

// Calcular penalización por pistas
const calculateHintPenalty = (hintsUsed, basePoints) => {
  if (hintsUsed === 0) return 0;
  const penalty = Math.floor(basePoints * BONUS.HINT_PENALTY_PERCENTAGE * hintsUsed);
  const minPoints = Math.floor(basePoints * BONUS.MIN_POINTS_PERCENTAGE);
  return Math.min(penalty, basePoints - minPoints);
};

// Calcular puntos finales
const calculateFinalPoints = (basePoints, timeSpent, timeLimit, hintsUsed) => {
  const speedBonus = calculateSpeedBonus(timeSpent, timeLimit, basePoints);
  const hintPenalty = calculateHintPenalty(hintsUsed, basePoints);
  return {
    base: basePoints,
    bonus: speedBonus,
    penalty: hintPenalty,
    total: basePoints + speedBonus - hintPenalty
  };
};

// Calcular racha diaria
const calculateStreak = (lastPlayedDate, currentStreak) => {
  if (!lastPlayedDate) return 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastPlayed = new Date(lastPlayedDate);
  lastPlayed.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today - lastPlayed) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return currentStreak;      // mismo día
  if (diffDays === 1) return currentStreak + 1;  // día consecutivo
  return 1;                                       // racha rota
};

// Calcular precisión
const calculateAccuracy = (gamesWon, gamesPlayed) => {
  if (gamesPlayed === 0) return 0;
  return Math.round((gamesWon / gamesPlayed) * 100);
};

// Formatear tiempo en mm:ss
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Respuesta de éxito estándar
const successResponse = (res, data, message = 'OK', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Respuesta de error estándar
const errorResponse = (res, message = 'Error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  getXPForNextLevel,
  calculateLevel,
  calculateSpeedBonus,
  calculateHintPenalty,
  calculateFinalPoints,
  calculateStreak,
  calculateAccuracy,
  formatTime,
  successResponse,
  errorResponse
};