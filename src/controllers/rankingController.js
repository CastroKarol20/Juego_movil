const User = require('../models/User');

// @desc    Obtener ranking global
// @route   GET /api/ranking
// @access  Private
exports.getGlobalRanking = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const rankings = await User.find({ isActive: true })
      .select('username avatar level totalPoints stats.gamesPlayed')
      .sort({ totalPoints: -1, level: -1 })
      .limit(parseInt(limit));

    // Agregar posición
    const rankingsWithPosition = rankings.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      avatar: user.avatar,
      level: user.level,
      totalPoints: user.totalPoints,
      gamesPlayed: user.stats.gamesPlayed
    }));

    // Encontrar posición del usuario actual
    const currentUserRank = await User.countDocuments({
      isActive: true,
      $or: [
        { totalPoints: { $gt: req.user.totalPoints } },
        {
          totalPoints: req.user.totalPoints,
          level: { $gt: req.user.level }
        }
      ]
    }) + 1;

    res.status(200).json({
      success: true,
      count: rankingsWithPosition.length,
      currentUserRank,
      data: rankingsWithPosition
    });

  } catch (error) {
    console.error('Error en getGlobalRanking:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ranking',
      error: error.message
    });
  }
};

// @desc    Obtener ranking por categoría
// @route   GET /api/ranking/category/:category
// @access  Private
exports.getRankingByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 50 } = req.query;

    // Agregar lógica según necesites
    // Por ahora devolvemos el ranking global

    res.status(200).json({
      success: true,
      message: 'Funcionalidad en desarrollo'
    });

  } catch (error) {
    console.error('Error en getRankingByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ranking por categoría',
      error: error.message
    });
  }
};

// @desc    Obtener posición del usuario en el ranking
// @route   GET /api/ranking/my-position
// @access  Private
exports.getMyPosition = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Calcular posición
    const position = await User.countDocuments({
      isActive: true,
      $or: [
        { totalPoints: { $gt: user.totalPoints } },
        {
          totalPoints: user.totalPoints,
          level: { $gt: user.level }
        }
      ]
    }) + 1;

    // Total de usuarios activos
    const totalUsers = await User.countDocuments({ isActive: true });

    // Obtener usuarios cercanos en el ranking
    const usersAbove = await User.find({
      isActive: true,
      $or: [
        { totalPoints: { $gt: user.totalPoints } },
        {
          totalPoints: user.totalPoints,
          level: { $gt: user.level }
        }
      ]
    })
      .select('username avatar level totalPoints')
      .sort({ totalPoints: -1, level: -1 })
      .limit(3);

    const usersBelow = await User.find({
      isActive: true,
      $or: [
        { totalPoints: { $lt: user.totalPoints } },
        {
          totalPoints: user.totalPoints,
          level: { $lt: user.level }
        }
      ]
    })
      .select('username avatar level totalPoints')
      .sort({ totalPoints: -1, level: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: {
        position,
        totalUsers,
        percentile: Math.round(((totalUsers - position) / totalUsers) * 100),
        user: user.toPublicJSON(),
        usersAbove,
        usersBelow
      }
    });

  } catch (error) {
    console.error('Error en getMyPosition:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener posición',
      error: error.message
    });
  }
};