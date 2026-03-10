const express = require('express');
const router = express.Router();
const {
  getGlobalRanking,
  getRankingByCategory,
  getMyPosition
} = require('../controllers/rankingController');
const { protect } = require('../middlewares/authMiddleware');

// GET /api/ranking
router.get('/', protect, getGlobalRanking);

// GET /api/ranking/my-position
router.get('/my-position', protect, getMyPosition);

// GET /api/ranking/category/:category
router.get('/category/:category', protect, getRankingByCategory);

module.exports = router;