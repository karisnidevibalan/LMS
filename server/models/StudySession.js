const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyMaterial',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // Study session details
  studyMode: {
    type: String,
    enum: ['quick', 'medium', 'detailed'],
    default: 'medium'
  },
  availableTime: {
    type: Number, // in minutes
    default: 30
  },
  characterUsed: {
    type: String,
    default: 'default'
  },
  
  // Session metrics
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  usedVoiceNarration: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'en'
  },
  
  // Learning quality metrics
  performanceScore: {
    type: Number,
    default: null,
    min: 0,
    max: 100
  },
  questionsAnswered: {
    type: Number,
    default: 0
  },
  questionsCorrect: {
    type: Number,
    default: 0
  },
  
  // Review recommendation
  needsReview: {
    type: Boolean,
    default: false
  },
  reviewReason: String,
  
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  lastAccessedTime: Date,
  
  notes: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for efficient querying
studySessionSchema.index({ student: 1, course: 1, createdAt: -1 });
studySessionSchema.index({ material: 1, student: 1 });

// Virtual for actual duration
studySessionSchema.virtual('sessionDuration').get(function() {
  if (this.endTime && this.startTime) {
    return Math.round((this.endTime - this.startTime) / 60000); // Convert ms to minutes
  }
  return 0;
});

// Middleware to calculate performance score on save
studySessionSchema.pre('save', function(next) {
  if (this.questionsAnswered > 0) {
    this.performanceScore = (this.questionsCorrect / this.questionsAnswered) * 100;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('StudySession', studySessionSchema);
