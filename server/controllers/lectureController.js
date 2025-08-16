const Lecture = require('../models/lecture');
const LectureComment = require('../models/LectureComment');

// Helpers (implement or import these!)
const getExplanation = async (text, mode) => {
  // Add your implementation
  return text; // dummy (replace)
};
const translateText = async (text, lang) => {
  // Add your implementation
  return text; // dummy (replace)
};

exports.uploadLecture = async (req, res) => {
  const { title, description, content, visuals } = req.body;
  const teacher = req.user.id;
  const lecture = await Lecture.create({ title, description, content, visuals, teacher });
  res.status(201).json(lecture);
};

exports.getLectures = async (req, res) => {
  const lectures = await Lecture.find().select('title description dateUploaded visuals');
  res.json(lectures);
};

exports.fetchLecture = async (req, res) => {
  const { mode = 'standard', lang = 'en' } = req.query;
  const lecture = await Lecture.findById(req.params.id).populate('teacher', 'name');
  if (!lecture) return res.status(404).send('Lecture not found');
  let explanation = await getExplanation(lecture.content, mode);
  let translated = await translateText(explanation, lang);
  res.json({ ...lecture._doc, content: translated });
};

exports.postComment = async (req, res) => {
  const comment = await LectureComment.create({
    lecture: req.params.id,
    user: req.user.id,
    text: req.body.text
  });
  res.status(201).json(comment);
};

exports.getComments = async (req, res) => {
  const comments = await LectureComment.find({ lecture: req.params.id }).populate('user', 'name');
  res.json(comments);
};
