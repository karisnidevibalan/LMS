import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Users, BookOpen, Calendar, Clock } from "lucide-react";
import { cachedGet, apiDelete, clearCachePattern } from "../../utils/api";

const StarRating = ({ rating, totalRatings, size = 16 }) => {
  const stars = [];
  const numericRating = Number(rating) || 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          size={size}
          fill="currentColor"
          className="text-yellow-500"
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star size={size} className="text-gray-300" />
          <Star
            size={size}
            fill="currentColor"
            className="text-yellow-500 absolute top-0 left-0"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        </div>
      );
    } else {
      stars.push(
        <Star key={i} size={size} className="text-gray-300" />
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {numericRating > 0 ? numericRating.toFixed(1) : 'No ratings'} {totalRatings > 0 && `(${totalRatings})`}
      </span>
    </div>
  );
};

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view your enrolled courses');
          setLoading(false);
          return;
        }

        const response = await cachedGet('/course/enrolled', 'enrollment', 2 * 60 * 1000, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setError(error.response?.data?.error || 'Failed to load enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleUnenroll = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to unenroll from "${courseTitle}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await apiDelete(`/course/${courseId}/enroll`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear enrollment cache and remove the course from the enrolled courses list
      clearCachePattern('enrollment');
      setEnrolledCourses(prev => prev.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      alert('Failed to unenroll from course. Please try again.');
    }
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
          <p className="text-xl mb-2">Error loading enrolled courses</p>
          <p>{error}</p>
          <Link 
            to="/login" 
            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Enrolled Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue your learning journey with your enrolled courses
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
            You haven't enrolled in any courses yet
          </p>
          <Link 
            to="/courses" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors inline-flex items-center"
          >
            <BookOpen size={20} className="mr-2" />
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-green-200 dark:border-green-800"
            >
              {course.thumbnail && (
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={`http://localhost:5000/uploads/${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                    Enrolled
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <StarRating 
                    rating={course.averageRating || 0} 
                    totalRatings={course.totalRatings || 0}
                  />
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      <span>{course.enrolledStudents?.length || 0} students</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Instructor:</span> {course.teacherId?.name || 'Unknown Teacher'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to={`/course/${course._id}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-center block"
                  >
                    Continue Learning
                  </Link>
                  
                  <button
                    onClick={() => handleUnenroll(course._id, course.title)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Unenroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {enrolledCourses.length > 0 && (
        <div className="mt-8 text-center">
          <Link 
            to="/courses" 
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md transition-colors inline-flex items-center"
          >
            <BookOpen size={20} className="mr-2" />
            Browse More Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
