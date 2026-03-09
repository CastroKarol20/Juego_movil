const mongoose = require('mongoose');
const { GAME_RESULTS } = require('../utils/constants');

const gameHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
    index: true
  },
  
  // Información del juego
  result: {
    type: String,
    required: true,
    enum: Object.values(GAME_RESULTS)
  },
  userAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  
  // Puntuación
  pointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  xpEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  bonusPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Tiempo
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  timeLimit: {
    type: Number,
    required: true
  },
  
  // Ayudas
  hintsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  isPerfect: {
    type: Boolean,
    default: false
  },
  
  // Snapshot del reto (por si cambia después)
  challengeInfo: {
    title: String,
    difficulty: String,
    category: String,
    icon: String
  },
  
  playedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Índices compuestos
gameHistorySchema.index({ userId: 1, playedAt: -1 });
gameHistorySchema.index({ result: 1 });

module.exports = mongoose.model('GameHistory', gameHistorySchema);