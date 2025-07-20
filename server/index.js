const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Log every request for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');

app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('✅ LMS Backend Running');
});

// DB Connection and Server Start
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
