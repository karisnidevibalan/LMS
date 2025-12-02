import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost, clearCachePattern } from '../../utils/api';

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage("❌ Please log in to add a course");
        return;
      }

      const response = await apiPost("/course", { title, description }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        // Clear cache to refresh course lists
        clearCachePattern('course');
        
        // Handle different response structures
        const courseData = response.data.course || response.data;
        const courseId = courseData?._id;
        
        if (courseId) {
          // Immediately redirect to materials upload page to add course content
          navigate(`/teacher/course/${courseId}/materials`, {
            state: { 
              newCourse: true, 
              message: '✅ Course created successfully! Now add study materials to get started.' 
            }
          });
        } else {
          setMessage("✅ Course added successfully!");
          setTimeout(() => {
            navigate('/teacher/courses');
          }, 1500);
        }
      } else {
        setMessage(`❌ ${response.data.error || response.data.message || "Failed to add course"}`);
      }
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage(`❌ ${error.response?.data?.error || error.message || "Error connecting to the server"}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Add New Course</h2>

        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 p-3 mb-4 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          required
        />

        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 p-3 mb-4 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-vertical"
          rows="4"
          required
        ></textarea>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg w-full font-semibold transition-colors shadow-md focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Add Course
        </button>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            message.includes('✅') 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddCourse;
