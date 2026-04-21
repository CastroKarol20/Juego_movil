const Achievement = require('../models/Achievement');
const { ACHIEVEMENT_CONDITIONS } = require('../utils/constants');

// Verificar y desbloquear logros
const checkAndUnlockAchievements = async (user) => {
  const allAchievements = await Achievement.find({ isActive: true });
  const newAchievements = [];

  for (const achievement of allAchievements) {
    // Si ya tiene el logro, saltar
    if (user.achievements.includes(achievement.achievementId)) continue;

    const unlocked = evaluateCondition(achievement.condition, user);

    if (unlocked) {
      user.achievements.push(achievement.achievementId);
      user.totalPoints += achievement.rewards.points || 0;
      user.currentXP += achievement.rewards.xp || 0;
      newAchievements.push({
        achievementId: achievement.achievementId,
        name: achievement.name,
        icon: achievement.icon,
        rarity: achievement.rarity,
        rewards: achievement.rewards
      });
    }
  }

  return newAchievements;
};

// Evaluar si se cumple la condición del logro
const evaluateCondition = (condition, user) => {
  switch (condition.type) {
    case ACHIEVEMENT_CONDITIONS.GAMES_WON:
      return user.stats.gamesWon >= condition.value;

    case ACHIEVEMENT_CONDITIONS.STREAK:
      return user.streak >= condition.value;

    case ACHIEVEMENT_CONDITIONS.LEVEL:
      return user.level >= condition.value;

    case ACHIEVEMENT_CONDITIONS.PERFECT_GAMES:
      return user.stats.perfectGames >= condition.value;

    case ACHIEVEMENT_CONDITIONS.GAMES_PLAYED:
      return user.stats.gamesPlayed >= condition.value;

    case ACHIEVEMENT_CONDITIONS.POINTS:
      return user.totalPoints >= condition.value;

    default:
      return false;
  }
};

// Obtener logros de un usuario con detalle completo
const getUserAchievementsDetail = async (userAchievementIds) => {
  const all = await Achievement.find({ isActive: true }).sort({ order: 1 });

  return all.map(achievement => ({
    ...achievement.toObject(),
    unlocked: userAchievementIds.includes(achievement.achievementId)
  }));
};

module.exports = {
  checkAndUnlockAchievements,
  evaluateCondition,
  getUserAchievementsDetail
};