const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const authMiddleware = require('../utils/authMiddleware'); // JWT verify (demo)

router.post('/upload', authMiddleware(['teacher']), lectureController.uploadLecture);

// GET /lectures/:id?mode=brief&lang=hi
router.get('/:id', authMiddleware(['teacher','student']), lectureController.fetchLecture);

module.exports = router;
