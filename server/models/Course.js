// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: String,
  level: String,
  duration: String,
  price: Number,
  isPublished: { type: Boolean, default: true },
  ratings: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    ratedAt: { type: Date, default: Date.now }
  }]
});

// Optional methods
courseSchema.methods.enrollStudent = async function (userId) {
  if (!this.enrolledStudents.includes(userId)) {
    this.enrolledStudents.push(userId);
    await this.save();
  }
};

courseSchema.methods.unenrollStudent = async function (userId) {
  this.enrolledStudents = this.enrolledStudents.filter(
    id => id.toString() !== userId.toString()
  );
  await this.save();
};

courseSchema.methods.isUserEnrolled = function (userId) {
  return this.enrolledStudents.some(
    id => id.toString() === userId.toString()
  );
};

courseSchema.methods.addRating = async function (userId, rating, comment) {
  this.ratings.push({ student: userId, rating, comment });
  await this.save();
};

module.exports = mongoose.model('Course', courseSchema);
