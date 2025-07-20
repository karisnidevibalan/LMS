const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();
console.log("🔑 OpenAI API Key:", process.env.OPENAI_API_KEY);

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Debug log for incoming requests
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.path}`);
  console.log("Body:", req.body);
  next();
});

// Import routes
const openaiRoutes = require('./routes/openai');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');

// Mount routes
app.use('/api/openai', openaiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: '✔️ Server is running!', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 MongoDB URI: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms'}`);
});
