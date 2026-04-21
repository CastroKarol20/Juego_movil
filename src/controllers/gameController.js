const GameHistory = require('../models/GameHistory');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { GAME_RESULTS, POINTS, XP_REWARDS } = require('../utils/constants');

// @desc    Iniciar un juego (obtener reto)
// @route   POST /api/games/start
// @access  Private
exports.startGame = async (req, res) => {
  try {
    const { challengeId } = req.body;

    if (!challengeId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del reto es requerido'
      });
    }

    const challenge = await Challenge.findById(challengeId);

    if (!challenge || !challenge.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Reto no encontrado o no disponible'
      });
    }

    const user = await User.findById(req.user.id);

    // Verificar nivel requerido
    if (user.level < challenge.requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `Necesitas nivel ${challenge.requiredLevel} para este reto`
      });
    }

    // Retornar reto SIN la respuesta correcta
    const challengeData = challenge.toObject();
    delete challengeData.correctAnswer;
    delete challengeData.alternativeAnswers;

    res.status(200).json({
      success: true,
      message: 'Reto iniciado',
      data: challengeData
    });

  } catch (error) {
    console.error('Error en startGame:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar juego'
    });
  }
};

// @desc    Enviar respuesta y finalizar juego
// @route   POST /api/games/submit
// @access  Private
exports.submitAnswer = async (req, res) => {
  try {
    const { challengeId, answer, timeSpent, hintsUsed = 0 } = req.body;

    // Validaciones
    if (!challengeId || !answer || timeSpent === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos (challengeId, answer, timeSpent)'
      });
    }

    const challenge = await Challenge.findById(challengeId);
    const user = await User.findById(req.user.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Reto no encontrado'
      });
    }

    // Verificar respuesta
    const isCorrect = challenge.checkAnswer(answer);
    const result = isCorrect ? GAME_RESULTS.WIN : GAME_RESULTS.LOSS;

    // Calcular puntos y XP
    let pointsEarned = 0;
    let xpEarned = 0;
    let bonusPoints = 0;

    if (isCorrect) {
      pointsEarned = challenge.points;
      xpEarned = challenge.xpReward;

      // Bonus por velocidad (si completó en menos del 50% del tiempo)
      const halfTime = challenge.timeLimit / 2;
      if (timeSpent < halfTime) {
        bonusPoints = Math.floor(challenge.points * 0.2); // 20% bonus
        pointsEarned += bonusPoints;
      }

      // Penalización por usar pistas
      if (hintsUsed > 0) {
        const penalty = Math.floor(challenge.points * 0.1 * hintsUsed);
        pointsEarned = Math.max(pointsEarned - penalty, challenge.points * 0.5);
      }
    }

    const isPerfect = isCorrect && hintsUsed === 0;

    // Guardar en historial
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

    // Actualizar estadísticas del usuario
    await updateUserStats(user, isCorrect, pointsEarned, xpEarned, timeSpent, isPerfect);

    // Actualizar estadísticas del reto
    await updateChallengeStats(challenge, isCorrect, timeSpent);

    // Verificar nuevos logros
    const newAchievements = await checkAchievements(user);

    res.status(200).json({
      success: true,
      message: isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta',
      data: {
        result,
        isCorrect,
        pointsEarned,
        xpEarned,
        bonusPoints,
        isPerfect,
        correctAnswer: isCorrect ? null : challenge.correctAnswer,
        newLevel: user.level,
        newAchievements,
        gameHistory: gameHistory._id
      }
    });

  } catch (error) {
    console.error('Error en submitAnswer:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar respuesta'
    });
  }
};

// Función auxiliar para actualizar stats del usuario
async function updateUserStats(user, isCorrect, points, xp, timeSpent, isPerfect) {
  // Actualizar estadísticas
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
  
  // Calcular precisión
  user.stats.averageAccuracy = Math.round(
    (user.stats.gamesWon / user.stats.gamesPlayed) * 100
  );

  // Actualizar puntos y XP
  user.totalPoints += points;
  user.currentXP += xp;

  // Sistema de niveles
  const XP_PER_LEVEL = 1000;
  while (user.currentXP >= XP_PER_LEVEL) {
    user.level += 1;
    user.currentXP -= XP_PER_LEVEL;
  }

  // Actualizar racha
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (user.lastPlayedDate) {
    const lastPlayed = new Date(user.lastPlayedDate);
    lastPlayed.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - lastPlayed) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Mismo día, no hacer nada
    } else if (diffDays === 1) {
      // Día consecutivo
      user.streak += 1;
    } else {
      // Racha rota
      user.streak = 1;
    }
  } else {
    // Primera vez jugando
    user.streak = 1;
  }

  user.lastPlayedDate = new Date();

  await user.save();
}

// Función auxiliar para actualizar stats del reto
async function updateChallengeStats(challenge, isCorrect, timeSpent) {
  challenge.statistics.timesPlayed += 1;
  
  if (isCorrect) {
    challenge.statistics.timesCompleted += 1;
  }

  // Actualizar tiempo promedio
  const totalTime = challenge.statistics.averageTime * (challenge.statistics.timesPlayed - 1) + timeSpent;
  challenge.statistics.averageTime = Math.round(totalTime / challenge.statistics.timesPlayed);

  // Actualizar tasa de éxito
  challenge.statistics.successRate = Math.round(
    (challenge.statistics.timesCompleted / challenge.statistics.timesPlayed) * 100
  );

  await challenge.save();
}

// Función auxiliar para verificar logros
async function checkAchievements(user) {
  const Achievement = require('../models/Achievement');
  const allAchievements = await Achievement.find({ isActive: true });
  const newAchievements = [];

  for (const achievement of allAchievements) {
    // Si ya tiene el logro, saltar
    if (user.achievements.includes(achievement.achievementId)) continue;

    let unlocked = false;

    // Verificar condición
    switch (achievement.condition.type) {
      case 'games_won':
        unlocked = user.stats.gamesWon >= achievement.condition.value;
        break;
      case 'streak':
        unlocked = user.streak >= achievement.condition.value;
        break;
      case 'level':
        unlocked = user.level >= achievement.condition.value;
        break;
      case 'perfect_games':
        unlocked = user.stats.perfectGames >= achievement.condition.value;
        break;
      case 'games_played':
        unlocked = user.stats.gamesPlayed >= achievement.condition.value;
        break;
      case 'points':
        unlocked = user.totalPoints >= achievement.condition.value;
        break;
    }

    if (unlocked) {
      user.achievements.push(achievement.achievementId);
      user.totalPoints += achievement.rewards.points || 0;
      user.currentXP += achievement.rewards.xp || 0;
      newAchievements.push(achievement);
    }
  }

  if (newAchievements.length > 0) {
    await user.save();
  }

  return newAchievements;
}

// @desc    Obtener historial de juegos del usuario
// @route   GET /api/games/history
// @access  Private
exports.getGameHistory = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const history = await GameHistory.find({ userId: req.user.id })
      .sort({ playedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('challengeId', 'title difficulty category icon');

    const total = await GameHistory.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: history.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: history
    });

  } catch (error) {
    console.error('Error en getGameHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial'
    });
  }
};

// @desc    Obtener detalle de un juego
// @route   GET /api/games/history/:id
// @access  Private
exports.getGameDetail = async (req, res) => {
  try {
    const game = await GameHistory.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('challengeId');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: game
    });

  } catch (error) {
    console.error('Error en getGameDetail:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener detalle del juego'
    });
  }
};