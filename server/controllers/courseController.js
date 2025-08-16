const Course = require('../models/Course');

const createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const teacherId = req.user.id;

    const course = await Course.create({ title, description, category, teacherId });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacherId', 'name');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacherId', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error getting course' });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!course.studentsEnrolled.includes(req.user.id)) {
      course.studentsEnrolled.push(req.user.id);
      await course.save();
    }

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error enrolling', error: err.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
};
