// components/CourseCard.jsx
import React from 'react';

const CourseCard = ({ course }) => (
  <div className="bg-white text-black rounded-2xl shadow-lg p-4 transition-transform transform hover:scale-105 hover:shadow-xl">
    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
    <p>{course.description}</p>
  </div>
);

export default CourseCard;