const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// Protected route example
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: 'Welcome to your protected dashboard!',
    user: req.user  // you get { id, name, role } from token
  });
});

module.exports = router;
