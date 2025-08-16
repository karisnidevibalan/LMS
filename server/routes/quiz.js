const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

// Teacher creates or updates quiz for a lecture
router.post('/:lectureId', authMiddleware(['teacher']), quizController.createOrUpdateQuiz);

// Student (or teacher) fetches quiz for lecture
router.get('/:lectureId', authMiddleware(['student','teacher']), quizController.getQuiz);

module.exports = router;
