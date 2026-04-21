const express = require('express');
const router = express.Router();
const { register, login, getMe, updatePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validateFields, validateEmail, validatePassword, validateUsername, rateLimit } = require('../middlewares/validateRequest');

// POST /api/auth/register
router.post('/register',
  rateLimit({ max: 10, windowMs: 15 * 60 * 1000 }),
  validateFields(['username', 'email', 'password']),
  validateEmail,
  validatePassword,
  validateUsername,
  register
);

// POST /api/auth/login
router.post('/login',
  rateLimit({ max: 10, windowMs: 15 * 60 * 1000 }),
  validateFields(['email', 'password']),
  login
);

// GET /api/auth/me
router.get('/me', protect, getMe);

// PUT /api/auth/update-password
router.put('/update-password',
  protect,
  validateFields(['currentPassword', 'newPassword']),
  validatePassword,
  updatePassword
);

module.exports = router;