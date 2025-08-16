const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['programming', 'design', 'business', 'marketing', 'science', 'mathematics', 'language', 'other'],
    default: 'other'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number, // Duration in hours
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  lessons: [{
    title: String,
    content: String,
    duration: Number,
    order: Number
  }]
}, {
  timestamps: true
});

// Virtual for average rating
courseSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / this.ratings.length).toFixed(1);
});

// Virtual for total students enrolled
courseSchema.virtual('totalStudents').get(function() {
  return this.enrolledStudents.length;
});

// Method to enroll a student
courseSchema.methods.enrollStudent = function(studentId) {
  if (!this.enrolledStudents.includes(studentId)) {
    this.enrolledStudents.push(studentId);
    return this.save();
  }
  throw new Error('Student already enrolled');
};

// Method to unenroll a student
courseSchema.methods.unenrollStudent = function(studentId) {
  const index = this.enrolledStudents.indexOf(studentId);
  if (index > -1) {
    this.enrolledStudents.splice(index, 1);
    return this.save();
  }
  throw new Error('Student not enrolled');
};

// Method to check if user is enrolled
courseSchema.methods.isUserEnrolled = function(userId) {
  return this.enrolledStudents.includes(userId);
};

// Method to add rating
courseSchema.methods.addRating = function(studentId, rating, comment) {
  // Check if student already rated
  const existingRating = this.ratings.find(r => r.student.toString() === studentId.toString());
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.comment = comment;
    existingRating.date = new Date();
  } else {
    this.ratings.push({
      student: studentId,
      rating,
      comment
    });
  }
  return this.save();
};

// Static method to search courses
courseSchema.statics.searchCourses = function(searchTerm) {
  return this.find({
    $and: [
      { isPublished: true },
      {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      }
    ]
  });
};

// Ensure virtual fields are serialized
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
