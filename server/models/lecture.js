const mongoose = require('mongoose');
const LectureSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,          // Original lecture body
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  visuals: [String],        // URLs or filenames
  dateUploaded: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Lecture', LectureSchema);
