const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: String,
  choices: [String],      // Array of possible answers
  correct: Number,        // Index of correct choice
  explanation: String     // Explanation (optional)
});

const QuizSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
  questions: [QuestionSchema]
});

module.exports = mongoose.model('Quiz', QuizSchema);
