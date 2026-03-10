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
      message: 'Error al obtener retos',
      error: error.message
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
      message: 'Error al obtener retos disponibles',
      error: error.message
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
      message: 'Error al obtener reto',
      error: error.message
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
      message: 'Error al crear reto',
      error: error.message
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
      message: 'Error al actualizar reto',
      error: error.message
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
      message: 'Error al eliminar reto',
      error: error.message
    });
  }
};