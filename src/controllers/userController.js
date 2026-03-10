const User = require('../models/User');

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile/:userId
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Error en getUserProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { username, avatar, settings } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos permitidos
    if (username) {
      // Verificar que el username no esté en uso
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El username ya está en uso'
        });
      }
      user.username = username;
    }

    if (avatar) user.avatar = avatar;
    if (settings) user.settings = { ...user.settings, ...settings };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas del usuario
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        level: user.level,
        currentXP: user.currentXP,
        totalPoints: user.totalPoints,
        streak: user.streak,
        stats: user.stats,
        achievements: user.achievements
      }
    });

  } catch (error) {
    console.error('Error en getUserStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

// @desc    Obtener logros del usuario
// @route   GET /api/users/achievements
// @access  Private
exports.getUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        achievements: user.achievements,
        total: user.achievements.length
      }
    });

  } catch (error) {
    console.error('Error en getUserAchievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener logros',
      error: error.message
    });
  }
};