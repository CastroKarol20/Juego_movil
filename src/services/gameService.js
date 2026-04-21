const GameHistory = require('../models/GameHistory');
const Challenge = require('../models/Challenge');
const { GAME_RESULTS } = require('../utils/constants');
const { calculateFinalPoints } = require('../utils/helpers');
const { processXP, processStreak, updateStats } = require('./levelService');
const { checkAndUnlockAchievements } = require('./achievementService');

// Procesar el resultado de una partida completa
const processGameResult = async (user, challenge, { answer, timeSpent, hintsUsed = 0 }) => {

  // Verificar respuesta
  const isCorrect = challenge.checkAnswer(answer);
  const result = isCorrect ? GAME_RESULTS.WIN : GAME_RESULTS.LOSS;
  const isPerfect = isCorrect && hintsUsed === 0;

  // Calcular puntos
  let pointsEarned = 0;
  let xpEarned = 0;
  let bonusPoints = 0;
  let penalty = 0;

  if (isCorrect) {
    const pointsResult = calculateFinalPoints(
      challenge.points,
      timeSpent,
      challenge.timeLimit,
      hintsUsed
    );
    pointsEarned = pointsResult.total;
    bonusPoints = pointsResult.bonus;
    penalty = pointsResult.penalty;
    xpEarned = challenge.xpReward;
  }

  // Guardar historial
  const gameHistory = await GameHistory.create({
    userId: user._id,
    challengeId: challenge._id,
    result,
    userAnswer: answer,
    isCorrect,
    pointsEarned,
    xpEarned,
    bonusPoints,
    timeSpent,
    timeLimit: challenge.timeLimit,
    hintsUsed,
    isPerfect,
    challengeInfo: {
      title: challenge.title,
      difficulty: challenge.difficulty,
      category: challenge.category,
      icon: challenge.icon
    }
  });

  // Actualizar usuario
  user.totalPoints += pointsEarned;
  updateStats(user, { isCorrect, timeSpent, isPerfect });
  processStreak(user);
  const { leveledUp, newLevel } = processXP(user, xpEarned);

  // Verificar logros
  const newAchievements = await checkAndUnlockAchievements(user);

  // Guardar usuario
  await user.save();

  // Actualizar estadísticas del reto
  await updateChallengeStats(challenge, isCorrect, timeSpent);

  return {
    result,
    isCorrect,
    pointsEarned,
    xpEarned,
    bonusPoints,
    penalty,
    isPerfect,
    leveledUp,
    newLevel,
    newAchievements,
    correctAnswer: isCorrect ? null : challenge.correctAnswer,
    gameHistoryId: gameHistory._id
  };
};

// Actualizar estadísticas del reto
const updateChallengeStats = async (challenge, isCorrect, timeSpent) => {
  challenge.statistics.timesPlayed += 1;

  if (isCorrect) challenge.statistics.timesCompleted += 1;

  const totalTime = challenge.statistics.averageTime *
    (challenge.statistics.timesPlayed - 1) + timeSpent;
  challenge.statistics.averageTime = Math.round(
    totalTime / challenge.statistics.timesPlayed
  );

  challenge.statistics.successRate = Math.round(
    (challenge.statistics.timesCompleted / challenge.statistics.timesPlayed) * 100
  );

  await challenge.save();
};

// Obtener historial paginado
const getGameHistory = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    GameHistory.find({ userId })
      .sort({ playedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('challengeId', 'title difficulty category icon'),
    GameHistory.countDocuments({ userId })
  ]);

  return {
    history,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

module.exports = { processGameResult, updateChallengeStats, getGameHistory };