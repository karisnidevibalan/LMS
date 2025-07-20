// src/components/pages/student/MyCourses.jsx
import React, { useState } from 'react';

const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const enrolledCourses = [
    {
      id: 1,
      title: 'Machine Learning Basics',
      progress: 60,
    },
    {
      id: 2,
      title: 'UI/UX Design Principles',
      progress: 90,
    },
    {
      id: 3,
      title: 'Advanced JavaScript',
      progress: 40,
    },
  ];

  const filteredCourses = enrolledCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen px-6 pt-20 pb-10 bg-gradient-to-br from-[#fcd5ce] via-[#fae1dd] to-[#f9c5d1] dark:from-[#1e1b4b] dark:to-[#312e81]">
      <h2 className="text-2xl font-bold text-[#4b006e] dark:text-white mb-4">My Enrolled Courses</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search courses..."
        className="w-full max-w-md mb-6 px-4 py-2 rounded border dark:bg-[#3e3a60] dark:border-gray-600"
      />

      {filteredCourses.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No matching courses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-[#2d2a4a] p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
                {course.title}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2 dark:bg-gray-600">
                <div
                  className="bg-purple-500 h-3 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Progress: {course.progress}%</p>
              <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                Continue
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
