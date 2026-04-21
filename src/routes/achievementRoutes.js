const express = require('express');
const router = express.Router();
const { getAllAchievements, createAchievement } = require('../controllers/achievementController');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');

// GET /api/achievements
router.get('/', optionalAuth, getAllAchievements);

// POST /api/achievements (requires auth)
router.post('/', protect, createAchievement);

module.exports = router;
