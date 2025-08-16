import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Calendar, BookOpen, Star, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const TeacherStudents = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Please log in to view your students");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/course/my-courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Error loading courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchEnrolledStudents = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/course/${courseId}/students`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setEnrolledStudents(response.data);
    } catch (err) {
      console.error("Error fetching enrolled students:", err);
      setError("Error loading enrolled students");
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchEnrolledStudents(course._id);
  };

  const goBack = () => {
    setSelectedCourse(null);
    setEnrolledStudents([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-20 pb-10 bg-gradient-to-b from-[#fdf4ff] via-[#e0e7ff] to-[#ede9fe] dark:from-[#1e1b4b] dark:to-[#312e81]">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            {selectedCourse && (
              <button
                onClick={goBack}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <h1 className="text-3xl font-bold text-[#4b006e] dark:text-white">
              {selectedCourse ? `Students in ${selectedCourse.title}` : 'My Students'}
            </h1>
          </div>
          <Link
            to="/teacher"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {!selectedCourse ? (
          // Course Selection View
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Select a course to view enrolled students
            </p>
            
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                  You haven't created any courses yet
                </p>
                <Link
                  to="/teacher/add"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors"
                >
                  Create Your First Course
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => handleCourseSelect(course)}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-purple-500"
                  >
                    {course.thumbnail && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={`http://localhost:5000/uploads/${course.thumbnail}`}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users size={16} className="mr-1" />
                          <span>{course.studentsEnrolled?.length || 0} students</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Star size={16} className="mr-1" />
                          <span>{course.averageRating?.toFixed(1) || 'No ratings'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Students List View
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Course Overview
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedCourse.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      <span>{enrolledStudents.length} students enrolled</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>Created {new Date(selectedCourse.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Star size={16} className="mr-1" />
                      <span>{selectedCourse.averageRating?.toFixed(1) || 'No ratings'} rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {enrolledStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  No students enrolled in this course yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledStudents.map((student) => (
                  <div
                    key={student._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Mail size={16} className="mr-2" />
                        <span>{student.email}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar size={16} className="mr-2" />
                        <span>
                          Enrolled {new Date(student.enrolledAt || student.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                        View Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudents;
