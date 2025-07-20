const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/enroll/:id', authMiddleware, enrollInCourse);

module.exports = router;
