const express = require('express');
const router = express.Router();
const {
  startGame,
  submitAnswer,
  getGameHistory,
  getGameDetail
} = require('../controllers/gameController');
const { protect } = require('../middlewares/authMiddleware');
const { validateFields, validateObjectId, validatePagination } = require('../middlewares/validateRequest');

// POST /api/games/start
router.post('/start',
  protect,
  validateFields(['challengeId']),
  startGame
);

// POST /api/games/submit
router.post('/submit',
  protect,
  validateFields(['challengeId', 'answer', 'timeSpent']),
  submitAnswer
);

// GET /api/games/history
router.get('/history', protect, validatePagination, getGameHistory);

// GET /api/games/history/:id
router.get('/history/:id', protect, validateObjectId('id'), getGameDetail);

module.exports = router;