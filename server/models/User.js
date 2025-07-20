const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'teacher'] },
  instituteName: String,
  educationLevel: String,
  careerDetails: String,
  idProofUrl: String,
});

module.exports = mongoose.model('User', userSchema);
