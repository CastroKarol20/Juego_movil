const Achievement = require('../models/Achievement');
const achievementService = require('../services/achievementService');

// @desc    Obtener todos los achievements (opcionalmente marcar desbloqueados)
// @route   GET /api/achievements
// @access  Public / Optional Auth
exports.getAllAchievements = async (req, res) => {
  try {
    if (req.user) {
      const data = await achievementService.getUserAchievementsDetail(req.user.achievements || []);
      return res.status(200).json({ success: true, count: data.length, data });
    }

    const achievements = await Achievement.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, count: achievements.length, data: achievements });

  } catch (error) {
    console.error('Error en getAllAchievements:', error);
    res.status(500).json({ success: false, message: 'Error al obtener achievements' });
  }
};

// @desc    Crear achievement (Admin)
// @route   POST /api/achievements
// @access  Private
exports.createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json({ success: true, message: 'Achievement creado', data: achievement });
  } catch (error) {
    console.error('Error en createAchievement:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Error al crear achievement' });
  }
};
