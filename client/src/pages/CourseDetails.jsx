// src/components/pages/CourseDetails.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Placeholder sample course
  const course = {
    id,
    title: 'React for Beginners',
    description: 'This course will teach you the fundamentals of React.js including components, state, props, and hooks.',
    category: 'Programming',
    level: 'Beginner',
  };

  const handleEnroll = () => {
    toast.success('Successfully enrolled!');
    navigate('/student/mycourses');
  };

  return (
    <div className="min-h-screen px-6 pt-20 pb-10 bg-gradient-to-br from-[#fcd5ce] via-[#fae1dd] to-[#f9c5d1] dark:from-[#1e1b4b] dark:to-[#312e81]">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#2d2a4a] p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-200 mb-4">{course.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{course.description}</p>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Category:</strong> {course.category}</p>
          <p><strong>Level:</strong> {course.level}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleEnroll}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Enroll Now
          </button>

          <button
            onClick={() => navigate(`/rate/${course.id}`)}
            className="bg-gray-200 dark:bg-gray-700 dark:text-white px-4 py-2 rounded hover:opacity-90 transition"
          >
            Rate this Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
