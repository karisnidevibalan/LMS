const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register with image upload
router.post('/register', authController.upload, authController.register);

// Login
router.post('/login', authController.login);

// Get current user (GET /api/auth/me)
router.get('/me', authMiddleware([]), authController.getProfile);

// Get user profile (legacy endpoint)
router.get('/profile', authMiddleware([]), authController.getProfile);

// Update user preferences (character, study settings)
router.put('/preferences', authMiddleware(['student', 'teacher']), authController.updatePreferences);

module.exports = router;
