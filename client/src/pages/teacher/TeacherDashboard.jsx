// src/components/pages/teacher/TeacherDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const TeacherDashboard = () => {
  // Sample teacher's course list
  const courses = [
    {
      id: 1,
      title: 'Introduction to AI',
      description: 'Learn the basics of Artificial Intelligence and its applications.',
    },
    {
      id: 2,
      title: 'React for Beginners',
      description: 'Build powerful UIs using React.js step by step.',
    },
  ];

  return (
    <div className="min-h-screen px-6 pt-20 pb-10 bg-gradient-to-b from-[#fdf4ff] via-[#e0e7ff] to-[#ede9fe] dark:from-[#1e1b4b] dark:to-[#312e81]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#4b006e] dark:text-white">Your Courses</h2>
        <Link
          to="/teacher/add"
          className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-600 transition"
        >
          <PlusCircle size={20} /> Add New Course
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-[#2d2a4a] p-4 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
              {course.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{course.description}</p>
            <Link
              to={`/teacher/course/${course.id}`}
              className="text-sm text-purple-600 hover:underline dark:text-purple-200"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
