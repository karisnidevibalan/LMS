// components/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Users, Star } from 'lucide-react';

const CourseCard = ({ course, showTeacherActions = false }) => (
  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-700">
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
      {showTeacherActions && (
        <Link
          to={`/teacher/course/${course._id}/edit`}
          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
        >
          <Edit size={18} />
        </Link>
      )}
    </div>
    
    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{course.description}</p>
    
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
      <div className="flex items-center gap-1">
        <Users size={16} />
        <span>{course.totalStudents || course.enrolledStudents?.length || 0} students</span>
      </div>
      
      {course.averageRating && (
        <div className="flex items-center gap-1">
          <Star size={16} fill="currentColor" className="text-yellow-500" />
          <span>{course.averageRating}</span>
        </div>
      )}
    </div>

    <div className="flex gap-2">
      <Link
        to={`/course/${course._id}`}
        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        View Details
      </Link>
      
      {showTeacherActions && (
        <Link
          to={`/teacher/course/${course._id}/lectures`}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Manage
        </Link>
      )}
    </div>

    {course.category && (
      <div className="mt-3">
        <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
          {course.category}
        </span>
      </div>
    )}
  </div>
);

export default CourseCard;