const mongoose = require('mongoose');
const { CATEGORIES, DIFFICULTIES } = require('../utils/constants');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: Object.values(CATEGORIES)
  },
  difficulty: {
    type: String,
    required: [true, 'La dificultad es requerida'],
    enum: Object.values(DIFFICULTIES)
  },
  
  // Contenido del reto
  question: {
    type: String,
    required: [true, 'La pregunta es requerida']
  },
  correctAnswer: {
    type: String,
    required: [true, 'La respuesta correcta es requerida']
  },
  alternativeAnswers: [{
    type: String
  }],
  hint: {
    type: String,
    default: ''
  },
  
  // Configuración
  timeLimit: {
    type: Number,
    required: true,
    min: 30,
    max: 600  // 10 minutos máximo
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  xpReward: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Requisitos
  requiredLevel: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Metadata
  icon: {
    type: String,
    default: '🎯'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Estadísticas del reto
  statistics: {
    timesPlayed: {
      type: Number,
      default: 0,
      min: 0
    },
    timesCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    averageTime: {
      type: Number,
      default: 0,
      min: 0
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }
}, {
  timestamps: true
});

// Índices
challengeSchema.index({ category: 1, difficulty: 1 });
challengeSchema.index({ requiredLevel: 1 });
challengeSchema.index({ isActive: 1 });
challengeSchema.index({ order: 1 });

// Método para verificar respuesta
challengeSchema.methods.checkAnswer = function(userAnswer) {
  const normalizedUserAnswer = userAnswer.toString().trim().toLowerCase();
  const normalizedCorrectAnswer = this.correctAnswer.toString().trim().toLowerCase();
  
  // Verificar respuesta principal
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return true;
  }
  
  // Verificar respuestas alternativas
  if (this.alternativeAnswers && this.alternativeAnswers.length > 0) {
    return this.alternativeAnswers.some(
      alt => alt.toString().trim().toLowerCase() === normalizedUserAnswer
    );
  }
  
  return false;
};

module.exports = mongoose.model('Challenge', challengeSchema);