const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  chapter: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  estimatedStudyTime: {
    type: Number, // in minutes
    default: 30
  },
  keywords: [{
    type: String,
    trim: true
  }],
  filePath: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  
  // AI-generated content caching
  cachedAdaptiveContent: {
    quick: String,
    medium: String,
    detailed: String
  },
  cachedDiagrams: [{
    mode: String,
    url: String,
    type: String // 'flowchart', 'mindmap', 'diagram'
  }],
  cachedVideos: [{
    title: String,
    url: String,
    duration: Number,
    source: String // 'youtube', 'vimeo', etc
  }],
  
  // Voice narration cache
  voiceNarrations: [{
    character: String,
    language: String,
    url: String,
    duration: Number,
    generatedAt: Date
  }],
  
  // Learning engagement metrics
  totalAccess: { type: Number, default: 0 },
  totalStudyTime: { type: Number, default: 0 }, // in minutes
  averageCompletionRate: { type: Number, default: 0 },
  studentFeedback: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpfulness: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  
  averageRating: { type: Number, default: 0 },
  
  // Content quality indicators
  isVerified: { type: Boolean, default: false },
  contentQualityScore: { type: Number, default: null, min: 0, max: 100 }
}, {
  timestamps: true
});

// Index for better query performance
studyMaterialSchema.index({ courseId: 1, chapter: 1 });
studyMaterialSchema.index({ teacherId: 1 });
studyMaterialSchema.index({ keywords: 1 });
studyMaterialSchema.index({ isActive: 1 });

// Virtual for content availability
studyMaterialSchema.virtual('contentAvailable').get(function() {
  return {
    hasAdaptiveContent: !!(this.cachedAdaptiveContent?.quick || this.cachedAdaptiveContent?.medium || this.cachedAdaptiveContent?.detailed),
    hasDiagrams: this.cachedDiagrams && this.cachedDiagrams.length > 0,
    hasVideos: this.cachedVideos && this.cachedVideos.length > 0,
    hasVoiceNarration: this.voiceNarrations && this.voiceNarrations.length > 0
  };
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
