// pages/AddCourse.jsx
import React from 'react';

const AddCourse = () => (
  <div className="flex justify-center items-center min-h-screen animate-fade">
    <form className="bg-white text-black p-8 rounded-xl shadow-md w-96">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <input type="text" placeholder="Course Title" className="w-full p-2 border rounded mb-4" />
      <textarea placeholder="Description" className="w-full p-2 border rounded mb-4"></textarea>
      <button className="bg-indigo-600 text-white py-2 px-4 rounded w-full">Add Course</button>
    </form>
  </div>
);

export default AddCourse;