const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏅'
  },
  category: {
    type: String,
    required: true,
    enum: ['victorias', 'racha', 'nivel', 'precision', 'tiempo', 'general']
  },
  
  // Condiciones para desbloquear
  condition: {
    type: {
      type: String,
      required: true,
      enum: ['games_won', 'streak', 'level', 'perfect_games', 'games_played', 'points']
    },
    value: {
      type: Number,
      required: true,
      min: 1
    }
  },
  
  // Recompensas
  rewards: {
    xp: {
      type: Number,
      default: 0,
      min: 0
    },
    points: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Metadata
  rarity: {
    type: String,
    enum: ['comun', 'raro', 'epico', 'legendario'],
    default: 'comun'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices
achievementSchema.index({ category: 1 });
achievementSchema.index({ isActive: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);