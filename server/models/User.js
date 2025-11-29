const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: { 
    type: String, 
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  instituteName: {
    type: String,
    trim: true
  },
  educationLevel: String,
  careerDetails: String,
  idProofUrl: String,
  
  // New fields for character voice feature
  favoriteCharacter: {
    type: String,
    default: 'default'
  },
  studyPreferences: {
    voiceEnabled: { type: Boolean, default: true },
    playbackSpeed: { type: Number, default: 1.0, min: 0.5, max: 2.0 },
    preferredLanguage: { type: String, default: 'en' },
    darkMode: { type: Boolean, default: false }
  },
  
  // Study analytics
  totalStudyTime: { type: Number, default: 0 }, // in minutes
  lastStudySession: Date,
  preferredStudyMode: { type: String, enum: ['quick', 'medium', 'detailed'], default: 'medium' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for email lookups
userSchema.index({ email: 1 });

// Middleware to update updatedAt timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
