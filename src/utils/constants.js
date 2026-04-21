// Sistema de niveles
const LEVELS = {
  XP_PER_LEVEL: 1000,
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

// Rareza de logros
const RARITY = {
  COMMON: 'comun',
  RARE: 'raro',
  EPIC: 'epico',
  LEGENDARY: 'legendario'
};

// Categorías de logros
const ACHIEVEMENT_CATEGORIES = {
  WINS: 'victorias',
  STREAK: 'racha',
  LEVEL: 'nivel',
  PRECISION: 'precision',
  TIME: 'tiempo',
  GENERAL: 'general'
};

// Tipos de condición de logros
const ACHIEVEMENT_CONDITIONS = {
  GAMES_WON: 'games_won',
  STREAK: 'streak',
  LEVEL: 'level',
  PERFECT_GAMES: 'perfect_games',
  GAMES_PLAYED: 'games_played',
  POINTS: 'points'
};

// Bonus y penalizaciones
const BONUS = {
  SPEED_BONUS_PERCENTAGE: 0.2,    // 20% bonus por velocidad
  SPEED_THRESHOLD: 0.5,           // completar en menos del 50% del tiempo
  HINT_PENALTY_PERCENTAGE: 0.1,   // 10% de penalización por pista
  MIN_POINTS_PERCENTAGE: 0.5      // mínimo 50% de los puntos base
};

// Paginación
const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

module.exports = {
  LEVELS,
  POINTS,
  XP_REWARDS,
  CATEGORIES,
  DIFFICULTIES,
  GAME_RESULTS,
  RARITY,
  ACHIEVEMENT_CATEGORIES,
  ACHIEVEMENT_CONDITIONS,
  BONUS,
  PAGINATION
};