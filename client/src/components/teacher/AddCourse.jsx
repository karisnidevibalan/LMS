// src/components/pages/teacher/AddCourse.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields.');
      return;
    }
    // Simulate success
    toast.success('Course added successfully!');
    navigate('/teacher');
  };

  return (
    <div className="min-h-screen px-6 pt-20 pb-10 bg-gradient-to-b from-[#fdf4ff] via-[#e0e7ff] to-[#ede9fe] dark:from-[#1e1b4b] dark:to-[#312e81]">
      <h2 className="text-2xl font-bold text-[#4b006e] dark:text-white mb-6">Add New Course</h2>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#2d2a4a] p-6 rounded-xl shadow max-w-xl mx-auto space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border dark:bg-[#3e3a60] dark:border-gray-600"
            placeholder="Enter course title"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border dark:bg-[#3e3a60] dark:border-gray-600"
            placeholder="Enter course description"
            rows="4"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category*</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border dark:bg-[#3e3a60] dark:border-gray-600"
          >
            <option value="">Select category</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Level</label>
          <input
            type="text"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border dark:bg-[#3e3a60] dark:border-gray-600"
            placeholder="Beginner / Intermediate / Advanced"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-xl w-full transition"
        >
          Submit Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;