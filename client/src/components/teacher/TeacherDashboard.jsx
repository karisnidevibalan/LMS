import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import CourseCard from '../Coursecard';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
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

    fetchCourses();
  }, []);

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

      {loading && <p className="text-gray-600 dark:text-gray-300">Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && courses.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300">No courses found. Add your first course!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} showTeacherActions={true} />
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
