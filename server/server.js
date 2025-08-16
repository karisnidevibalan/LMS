const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const lecturesRouter = require('./routes/lectures');


// Load environment variables
dotenv.config();
console.log("🔑 OpenAI API Key:", process.env.OPENAI_API_KEY);

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(compression()); // Enable gzip compression
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5176'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Debug log for incoming requests
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.path}`);
  console.log("Body:", req.body);
  next();
});
app.use('/api/lectures', lecturesRouter);
app.use('/api/quizzes', require('./routes/quiz'));
// Import routes
const openaiRoutes = require('./routes/openai');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/course'); // Use the main course.js file
const studyMaterialRoutes = require('./routes/studyMaterials');

// Mount routes
app.use('/api/openai', openaiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/study-materials', studyMaterialRoutes);

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
