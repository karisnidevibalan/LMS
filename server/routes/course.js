const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/course - Get all published courses
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;

    let courses;
    if (search) {
      courses = await Course.searchCourses(search)
        .populate('teacherId', 'name email')
        .select('-lessons.content');
    } else {
      courses = await Course.find(query)
        .populate('teacherId', 'name email')
        .select('-lessons.content')
        .sort({ createdAt: -1 });
    }

    res.json(courses);
  } catch (err) {
    console.error('❌ Failed to fetch courses:', err.message);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/course/:id - Get single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacherId', 'name email')
      .populate('enrolledStudents', 'name email')
      .populate('ratings.student', 'name');

    if (!course) return res.status(404).json({ error: 'Course not found' });

    res.json(course);
  } catch (err) {
    console.error('❌ Failed to fetch course:', err.message);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST /api/course - Create a new course (teacher only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, category, level, duration, price } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can create courses' });
    }

    const newCourse = new Course({
      title,
      description,
    });

    const saved = await newCourse.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Failed to save course:', err.message);
    res.status(500).json({ error: 'Failed to add course', details: err.message });
  }
});

// PUT /api/course/:id - Update course (teacher only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (!course.teacherId.equals(req.user.id)) {
      return res.status(403).json({ error: 'Only the course teacher can update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCourse);
  } catch (err) {
    console.error('❌ Failed to update course:', err.message);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// POST /api/course/:id/enroll - Enroll in a course (student only)
router.post('/:id/enroll', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can enroll in courses' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await course.enrollStudent(req.user.id);
    res.json({ message: 'Successfully enrolled in course' });
  } catch (err) {
    console.error('❌ Failed to enroll:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/course/:id/enroll - Unenroll from course (student only)
router.delete('/:id/enroll', verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await course.unenrollStudent(req.user.id);
    res.json({ message: 'Successfully unenrolled from course' });
  } catch (err) {
    console.error('❌ Failed to unenroll:', err.message);
    res.status(500).json({ error: 'Failed to unenroll from course' });
  }
});

// POST /api/course/:id/rate - Rate a course (only if enrolled)
router.post('/:id/rate', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (!course.isUserEnrolled(req.user.id)) {
      return res.status(403).json({ error: 'You must be enrolled to rate this course' });
    }

    await course.addRating(req.user.id, rating, comment);
    res.json({ message: 'Rating added successfully' });
  } catch (err) {
    console.error('❌ Failed to add rating:', err.message);
    res.status(500).json({ error: 'Failed to add rating' });
  }
});

// GET /api/course/teacher/:teacherId - Get all courses by a teacher
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const courses = await Course.find({ teacherId: req.params.teacherId })
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    console.error('❌ Failed to fetch teacher courses:', err.message);
    res.status(500).json({ error: 'Failed to fetch teacher courses' });
  }
});

module.exports = router;
