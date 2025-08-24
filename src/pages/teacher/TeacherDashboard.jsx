// src/components/pages/teacher/TeacherDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, RefreshCw } from 'lucide-react';
import CourseCard from '../../components/Coursecard';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please log in to view your courses");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/course/my-courses", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await res.json();

      if (res.ok) {
        setCourses(data);
        setError("");
      } else {
        setError(data.error || "Failed to fetch courses");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen px-6 pt-20 pb-10 bg-gradient-to-b from-[#fdf4ff] via-[#e0e7ff] to-[#ede9fe] dark:from-[#1e1b4b] dark:to-[#312e81]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#4b006e] dark:text-white">Teacher Dashboard</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCourses}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-xl shadow hover:bg-gray-600 transition"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} /> 
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <Link
            to="/teacher/add"
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-600 transition"
          >
            <PlusCircle size={20} /> Add New Course
          </Link>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link
          to="/teacher/courses"
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors text-center"
        >
          <div className="text-2xl mb-2">📚</div>
          <p className="font-medium">Manage Courses</p>
        </Link>
        
        <Link
          to="/teacher/students"
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors text-center"
        >
          <div className="text-2xl mb-2">👥</div>
          <p className="font-medium">My Students</p>
        </Link>
        
        <Link
          to="/teacher/add"
          className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg transition-colors text-center"
        >
          <div className="text-2xl mb-2">➕</div>
          <p className="font-medium">Add Course</p>
        </Link>
        
        <Link
          to="/courses"
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors text-center"
        >
          <div className="text-2xl mb-2">🌐</div>
          <p className="font-medium">All Courses</p>
        </Link>
      </div>

      <h3 className="text-xl font-semibold text-[#4b006e] dark:text-white mb-4">Your Courses</h3>

      {loading && <p className="text-gray-600 dark:text-gray-300">Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && courses.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300">No courses found. Add your first course!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} showTeacherActions={true} />
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
