const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register with image upload
router.post('/register', authController.upload, authController.register);

// Login
router.post('/login', authController.login);

module.exports = router;
