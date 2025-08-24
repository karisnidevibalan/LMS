const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_here';

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, instituteName, educationLevel, careerDetails } = req.body;
    console.log("📥 Register attempt:", { name, email, role, instituteName, educationLevel });

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Email already exists:", email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = new User({ 
      name, 
      email, 
      password, 
      role: role || 'student',
      instituteName,
      educationLevel,
      careerDetails
    });
    await newUser.save();
// After await newUser.save();
const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
  expiresIn: '1d',
});

res.status(201).json({
  message: 'User registered successfully',
  token,
  user: {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  }
});

    console.log("✅ User registered:", newUser.name);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log("✅ Login successful:", user.name);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Get current authenticated user
const authMiddleware = require('../middleware/authMiddleware');
router.get('/me', authMiddleware(['student', 'teacher', 'admin']), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
    // Add other fields as needed
  });
});

module.exports = router;
