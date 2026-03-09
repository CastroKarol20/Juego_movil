// Niveles y XP
const LEVELS = {
  XP_PER_LEVEL: 1000,      // XP base por nivel
  MAX_LEVEL: 100
};

// Puntos por dificultad
const POINTS = {
  EASY: 100,
  MEDIUM: 250,
  HARD: 500
};

// XP por dificultad
const XP_REWARDS = {
  EASY: 50,
  MEDIUM: 100,
  HARD: 200
};

// Categorías de retos
const CATEGORIES = {
  LOGIC: 'logica',
  MATH: 'matematica',
  PATTERNS: 'patrones'
};

// Dificultades
const DIFFICULTIES = {
  EASY: 'facil',
  MEDIUM: 'medio',
  HARD: 'dificil'
};

// Resultados de juego
const GAME_RESULTS = {
  WIN: 'victoria',
  LOSS: 'derrota',
  ABANDONED: 'abandonado'
};

module.exports = {
  LEVELS,
  POINTS,
  XP_REWARDS,
  CATEGORIES,
  DIFFICULTIES,
  GAME_RESULTS
};