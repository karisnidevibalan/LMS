import React from 'react';

const courses = [
  { id: 1, title: 'JavaScript Mastery', instructor: 'Jane Doe' },
  { id: 2, title: 'UI/UX Design Basics', instructor: 'John Smith' },
  { id: 3, title: 'React for Beginners', instructor: 'Alice Brown' },
];

const Courses = () => {
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <div
          key={course.id}
          className="rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 p-6 text-white shadow-lg hover:scale-105 transition-transform"
        >
          <h3 className="text-xl font-bold mb-2">{course.title}</h3>
          <p className="text-sm">Instructor: {course.instructor}</p>
        </div>
      ))}
    </div>
  );
};

export default Courses;