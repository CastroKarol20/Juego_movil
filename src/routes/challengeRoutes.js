const express = require('express');
const router = express.Router();
const {
  getAllChallenges,
  getAvailableChallenges,
  getChallengeById,
  getChallengesByCategory,
  getCategoriesSummary,
  createChallenge,
  updateChallenge,
  deleteChallenge
} = require('../controllers/challengeController');
const { protect } = require('../middlewares/authMiddleware');
const { validateObjectId } = require('../middlewares/validateRequest');

// GET /api/challenges
router.get('/', protect, getAllChallenges);

// GET /api/challenges/available
router.get('/available', protect, getAvailableChallenges);

// GET /api/challenges/categories-summary
router.get('/categories-summary', protect, getCategoriesSummary);

// GET /api/challenges/by-category/:category
router.get('/by-category/:category', protect, getChallengesByCategory);

// GET /api/challenges/:id
router.get('/:id', protect, validateObjectId('id'), getChallengeById);

// POST /api/challenges
router.post('/', protect, createChallenge);

// PUT /api/challenges/:id
router.put('/:id', protect, validateObjectId('id'), updateChallenge);

// DELETE /api/challenges/:id
router.delete('/:id', protect, validateObjectId('id'), deleteChallenge);

module.exports = router;