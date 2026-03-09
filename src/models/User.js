const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    unique: true,
    trim: true,
    minlength: [3, 'El username debe tener al menos 3 caracteres'],
    maxlength: [20, 'El username no puede exceder 20 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false  // No incluir en queries por defecto
  },
  avatar: {
    type: String,
    default: '🎯'
  },
  
  // Gamificación
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  currentXP: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Racha
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastPlayedDate: {
    type: Date,
    default: null
  },
  
  // Estadísticas
  stats: {
    gamesPlayed: {
      type: Number,
      default: 0,
      min: 0
    },
    gamesWon: {
      type: Number,
      default: 0,
      min: 0
    },
    gamesLost: {
      type: Number,
      default: 0,
      min: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
      min: 0
    },
    averageAccuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    perfectGames: {
      type: Number,
      default: 0,
      min: 0
    },
    consecutiveWins: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Logros desbloqueados
  achievements: [{
    type: String
  }],
  
  // Configuración
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    sounds: {
      type: Boolean,
      default: true
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices
userSchema.index({ totalPoints: -1 });
userSchema.index({ level: -1 });
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si el password fue modificado
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Método para obtener datos públicos del usuario
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    level: this.level,
    currentXP: this.currentXP,
    totalPoints: this.totalPoints,
    streak: this.streak,
    stats: this.stats,
    achievements: this.achievements,
    settings: this.settings,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);