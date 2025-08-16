const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const authMiddleware = require('../middleware/authMiddleware');

// Upload a lecture (teacher only)
router.post('/upload', authMiddleware(['teacher']), lectureController.uploadLecture);

// Get all lectures (students and teachers)
router.get('/', authMiddleware(['teacher', 'student']), lectureController.getLectures);

// Get a single lecture, with language/mode support
router.get('/:id', authMiddleware(['teacher', 'student']), lectureController.fetchLecture);

// Comment endpoints
router.post('/:id/comments', authMiddleware(['teacher', 'student']), lectureController.postComment);
router.get('/:id/comments', authMiddleware(['teacher', 'student']), lectureController.getComments);
router.post('/something', authMiddleware(['teacher']));
module.exports = router;
