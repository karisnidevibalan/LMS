const Quiz = require('../models/Quiz');

exports.createOrUpdateQuiz = async (req, res) => {
  const { questions } = req.body;
  let quiz = await Quiz.findOne({ lecture: req.params.lectureId });
  if (quiz) {
    quiz.questions = questions;
    await quiz.save();
  } else {
    quiz = await Quiz.create({ lecture: req.params.lectureId, questions });
  }
  res.json(quiz);
};

exports.getQuiz = async (req, res) => {
  const quiz = await Quiz.findOne({ lecture: req.params.lectureId });
  if (!quiz) return res.status(404).send('No quiz for this lecture');
  res.json(quiz);
};
