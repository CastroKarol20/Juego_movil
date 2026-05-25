const Challenge = require('../models/Challenge');

// @desc    Obtener todos los retos
// @route   GET /api/challenges
// @access  Private
exports.getAllChallenges = async (req, res) => {
  try {
    const { category, difficulty } = req.query;

    // Construir filtro
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const challenges = await Challenge.find(filter).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: challenges.length,
      data: challenges
    });

  } catch (error) {
    console.error('Error en getAllChallenges:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener retos'
    });
  }
};

// @desc    Obtener retos disponibles para el usuario
// @route   GET /api/challenges/available
// @access  Private
exports.getAvailableChallenges = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener retos que cumplan con el nivel del usuario
    const challenges = await Challenge.find({
      isActive: true,
      requiredLevel: { $lte: user.level }
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: challenges.length,
      data: challenges
    });

  } catch (error) {
    console.error('Error en getAvailableChallenges:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener retos disponibles'
    });
  }
};

// @desc    Obtener un reto por ID
// @route   GET /api/challenges/:id
// @access  Private
exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Reto no encontrado'
      });
    }

    if (!challenge.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Este reto no está disponible'
      });
    }

    res.status(200).json({
      success: true,
      data: challenge
    });

  } catch (error) {
    console.error('Error en getChallengeById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reto'
    });
  }
};

// @desc    Crear nuevo reto (Admin)
// @route   POST /api/challenges
// @access  Private/Admin
exports.createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Reto creado exitosamente',
      data: challenge
    });

  } catch (error) {
    console.error('Error en createChallenge:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear reto'
    });
  }
};

// @desc    Actualizar reto (Admin)
// @route   PUT /api/challenges/:id
// @access  Private/Admin
exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Reto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reto actualizado exitosamente',
      data: challenge
    });

  } catch (error) {
    console.error('Error en updateChallenge:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar reto'
    });
  }
};

// @desc    Eliminar reto (Admin)
// @route   DELETE /api/challenges/:id
// @access  Private/Admin
exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Reto no encontrado'
      });
    }

    // Soft delete - solo marcar como inactivo
    challenge.isActive = false;
    await challenge.save();

    res.status(200).json({
      success: true,
      message: 'Reto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error en deleteChallenge:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar reto'
    });
  }
};

// @desc    Obtener retos por categoría con información de niveles desbloqueados
// @route   GET /api/challenges/by-category/:category
// @access  Private
exports.getChallengesByCategory = async (req, res) => {
  try {
    const User = require('../models/User');
    const { category } = req.params;

    // Obtener usuario para conocer su nivel
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener todos los retos de esta categoría
    const allChallenges = await Challenge.find({
      category: category,
      isActive: true
    }).sort({ requiredLevel: 1, order: 1 });

    if (allChallenges.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay retos en esta categoría'
      });
    }

    // Agrupar retos por nivel
    const levelMap = new Map();
    allChallenges.forEach(challenge => {
      const level = challenge.requiredLevel;
      if (!levelMap.has(level)) {
        levelMap.set(level, []);
      }
      levelMap.get(level).push(challenge);
    });

    // Construir respuesta con información de desbloqueo
    const levels = Array.from(levelMap.entries()).map(([level, challenges]) => {
      const isUnlocked = level <= user.level;
      
      // Contar completados solo si está desbloqueado
      let completedCount = 0;
      if (isUnlocked) {
        completedCount = challenges.filter(c => 
          user.completedChallenges && user.completedChallenges.includes(c._id.toString())
        ).length;
      }

      return {
        level: level,
        isUnlocked: isUnlocked,
        userCurrentLevel: user.level,
        requiredToUnlock: level,
        challengesCount: challenges.length,
        completedCount: completedCount,
        lockReason: isUnlocked 
          ? null 
          : `Debes alcanzar nivel ${level} para desbloquear`,
        challenges: isUnlocked ? challenges : null
      };
    });

    res.status(200).json({
      success: true,
      data: {
        category: category,
        totalChallenges: allChallenges.length,
        levels: levels
      }
    });

  } catch (error) {
    console.error('Error en getChallengesByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener retos por categoría'
    });
  }
};

// @desc    Obtener resumen de todas las categorías
// @route   GET /api/challenges/categories-summary
// @access  Private
exports.getCategoriesSummary = async (req, res) => {
  try {
    const User = require('../models/User');
    const { CATEGORIES } = require('../utils/constants');

    // Obtener usuario
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Para cada categoría, contar retos completados y totales
    const categoriesData = [];

    for (const [key, categoryValue] of Object.entries(CATEGORIES)) {
      const categoryName = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
      
      // Total de retos en la categoría
      const allChallenges = await Challenge.find({
        category: categoryValue,
        isActive: true
      });

      // Retos desbloqueados del usuario
      const unlockedChallenges = allChallenges.filter(c => c.requiredLevel <= user.level);

      // Retos completados
      const completedChallenges = unlockedChallenges.filter(c =>
        user.completedChallenges && user.completedChallenges.includes(c._id.toString())
      );

      // Contar niveles
      const uniqueLevels = new Set(allChallenges.map(c => c.requiredLevel));
      const unlockedLevels = Array.from(uniqueLevels).filter(level => level <= user.level).length;

      const progress = allChallenges.length > 0 
        ? Math.round((completedChallenges.length / allChallenges.length) * 100)
        : 0;

      categoriesData.push({
        category: categoryValue,
        name: categoryName,
        totalChallenges: allChallenges.length,
        completedChallenges: completedChallenges.length,
        progress: progress,
        unlockedLevels: unlockedLevels,
        totalLevels: uniqueLevels.size,
        icon: `${categoryValue}_icon`,
        nextRewardAt: unlockedLevels < uniqueLevels.size 
          ? `Nivel ${unlockedLevels + 1}`
          : 'Completada'
      });
    }

    res.status(200).json({
      success: true,
      data: categoriesData
    });

  } catch (error) {
    console.error('Error en getCategoriesSummary:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen de categorías'
    });
  }
};