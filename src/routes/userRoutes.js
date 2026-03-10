const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, getUserStats, getUserAchievements } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { validateObjectId } = require('../middlewares/validateRequest');

// GET /api/users/stats
router.get('/stats', protect, getUserStats);

// GET /api/users/achievements
router.get('/achievements', protect, getUserAchievements);

// GET /api/users/profile/:userId
router.get('/profile/:userId', protect, validateObjectId('userId'), getUserProfile);

// PUT /api/users/profile
router.put('/profile', protect, updateProfile);

module.exports = router;