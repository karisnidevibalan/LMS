const express = require('express');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add Course - requires teacher authentication
router.post('/', authMiddleware(['teacher']), async (req, res) => {
  try {
    console.log('Course creation route hit');
    console.log('User from middleware:', req.user);
    console.log('Request body:', req.body);
    
    const { title, description, category, level, duration, price } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    console.log('Creating course with teacherId:', req.user._id);

    const course = new Course({
      title,
      description,
      teacherId: req.user._id, // Get from authenticated user
      category,
      level,
      duration,
      price
    });

    console.log('Course object created:', course);
    await course.save();
    console.log('Course saved successfully');
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get All Courses (public)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('teacherId', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Course by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacherId', 'name email');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get All Courses of a Teacher (protected)
router.get('/teacher/:teacherId', authMiddleware(['teacher', 'student']), async (req, res) => {
  try {
    const courses = await Course.find({ teacherId: req.params.teacherId }).populate('teacherId', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Teacher's own courses
router.get('/my-courses', authMiddleware(['teacher']), async (req, res) => {
  try {
    console.log('Fetching courses for teacher:', req.user._id);
    const courses = await Course.find({ teacherId: req.user._id });
    console.log('Found courses:', courses.length);
    res.json(courses);
  } catch (err) {
    console.error('Error fetching teacher courses:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update Course (teacher only)
router.put('/:id', authMiddleware(['teacher']), async (req, res) => {
  try {
    // Check if the course belongs to the authenticated teacher
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (course.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own courses' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Course (teacher only)
router.delete('/:id', authMiddleware(['teacher']), async (req, res) => {
  try {
    // Check if the course belongs to the authenticated teacher
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (course.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own courses' });
    }

    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get enrolled students for a specific course (teacher only)
router.get('/:id/students', authMiddleware(['teacher']), async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user._id;

    // Find the course and verify it belongs to the teacher
    const course = await Course.findOne({ _id: id, teacherId: teacherId })
      .populate('enrolledStudents', 'name email createdAt')
      .select('enrolledStudents');

    if (!course) {
      return res.status(404).json({ error: 'Course not found or access denied' });
    }

    res.json(course.enrolledStudents);
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    res.status(500).json({ error: 'Failed to fetch enrolled students' });
  }
});

// Get enrolled courses for a student
router.get('/enrolled', authMiddleware(['student']), async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching enrolled courses for user:', userId);
    
    const enrolledCourses = await Course.find({
      enrolledStudents: userId
    })
    .populate('teacherId', 'name email')
    .populate('ratings.student', 'name')
    .sort({ createdAt: -1 });

    console.log('Found enrolled courses:', enrolledCourses.length);
    console.log('Enrolled courses:', enrolledCourses.map(course => ({ 
      id: course._id, 
      title: course.title,
      enrolledStudents: course.enrolledStudents 
    })));

    res.json(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
});

// Enroll student in a course
router.post('/:id/enroll', authMiddleware(['student']), async (req, res) => {
  try {
    console.log('Enrollment request for course:', req.params.id, 'by user:', req.user._id);
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      console.log('Course not found:', req.params.id);
      return res.status(404).json({ error: 'Course not found' });
    }

    console.log('Current enrolled students:', course.enrolledStudents);

    // Check if student is already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      console.log('Student already enrolled');
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    await course.enrollStudent(req.user._id);
    console.log('Student enrolled successfully. New enrolled students:', course.enrolledStudents);
    res.json({ message: 'Successfully enrolled in course' });
  } catch (err) {
    console.error('Error enrolling in course:', err);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Unenroll from a course (students only)
router.delete('/:id/enroll', authMiddleware(['student']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await course.unenrollStudent(req.user._id);
    res.json({ message: 'Successfully unenrolled from course' });
  } catch (err) {
    console.error('Error unenrolling from course:', err);
    res.status(500).json({ error: 'Failed to unenroll from course' });
  }
});

// Check enrollment status
router.get('/:id/enrollment-status', authMiddleware(['student']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const isEnrolled = course.isUserEnrolled(req.user._id);
    res.json({ isEnrolled });
  } catch (err) {
    console.error('Error checking enrollment status:', err);
    res.status(500).json({ error: 'Failed to check enrollment status' });
  }
});

// Rate a course (students only)
router.post('/:id/rate', authMiddleware(['student']), async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if student is enrolled (optional - you can remove this check if you want anyone to rate)
    // if (!course.enrolledStudents.includes(req.user._id)) {
    //   return res.status(403).json({ error: 'You must be enrolled to rate this course' });
    // }

    await course.addRating(req.user._id, rating, comment);
    res.json({ message: 'Rating added successfully' });
  } catch (err) {
    console.error('Error adding rating:', err);
    res.status(500).json({ error: 'Failed to add rating' });
  }
});

module.exports = router;
