import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Users, Heart, BookOpen, Check } from "lucide-react";
import axios from "axios";

const StarRating = ({ rating, totalRatings, size = 16 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

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
        {rating > 0 ? rating : 'No ratings'} {totalRatings > 0 && `(${totalRatings})`}
      </span>
    </div>
  );
};

const RatingModal = ({ course, isOpen, onClose, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/course/${course._id}/rate`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      onRatingSubmit();
      onClose();
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Rate: {course.title}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    fill={star <= (hoveredRating || rating) ? "currentColor" : "none"}
                    className={star <= (hoveredRating || rating) ? "text-yellow-500" : "text-gray-300"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows="3"
              placeholder="Share your thoughts about this course..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState({});
  const [enrollmentLoading, setEnrollmentLoading] = useState({});

  const fetchEnrollmentStatus = async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token || !user || user.role !== 'student') return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/course/${courseId}/enrollment-status`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setEnrollmentStatus(prev => ({
        ...prev,
        [courseId]: response.data.isEnrolled
      }));
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  const handleEnrollment = async (courseId, isCurrentlyEnrolled) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to enroll in courses');
      return;
    }

    setEnrollmentLoading(prev => ({ ...prev, [courseId]: true }));

    try {
      if (isCurrentlyEnrolled) {
        // Unenroll
        await axios.delete(
          `http://localhost:5000/api/course/${courseId}/enroll`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setEnrollmentStatus(prev => ({ ...prev, [courseId]: false }));
      } else {
        // Enroll
        await axios.post(
          `http://localhost:5000/api/course/${courseId}/enroll`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setEnrollmentStatus(prev => ({ ...prev, [courseId]: true }));
      }

      // Refresh courses to update student count
      const coursesResponse = await axios.get('http://localhost:5000/api/course');
      setCourses(coursesResponse.data);
    } catch (error) {
      console.error('Error with enrollment:', error);
      alert(error.response?.data?.error || 'Failed to update enrollment');
    } finally {
      setEnrollmentLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesResponse = await axios.get('http://localhost:5000/api/course');
        setCourses(coursesResponse.data);

        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userResponse = await axios.get('http://localhost:5000/api/auth/profile', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userResponse.data);
            
            // If user is a student, fetch enrollment status for all courses
            if (userResponse.data.role === 'student') {
              coursesResponse.data.forEach(course => {
                fetchEnrollmentStatus(course._id);
              });
            }
          } catch (error) {
            console.log('User not logged in or invalid token');
          }
        }
      } catch (error) {
        setError('Failed to fetch courses');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRateClick = (course) => {
    setSelectedCourse(course);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async () => {
    // Refresh courses to get updated ratings
    try {
      const response = await axios.get('http://localhost:5000/api/course');
      setCourses(response.data);
    } catch (err) {
      console.error('Error refreshing courses:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-gray-600 dark:text-gray-400">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Available Courses
      </h1>
      
      {courses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No courses available yet.</p>
          <Link 
            to="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Login to Add Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <div
              key={course._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex-1">
                  {course.title}
                </h3>
                {user && user.role === 'student' && enrollmentStatus[course._id] && (
                  <div className="flex items-center text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md ml-2">
                    <Check size={16} className="mr-1" />
                    <span className="text-sm font-medium">Enrolled</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {course.description}
              </p>
              
              {/* Rating Display */}
              <div className="mb-4">
                <StarRating 
                  rating={parseFloat(course.averageRating) || 0}
                  totalRatings={course.ratings?.length || 0}
                />
              </div>

              {/* Course Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{course.enrolledStudents?.length || 0} students</span>
                </div>
                {course.category && (
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs">
                    {course.category}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    By: {course.teacherId?.name || 'Unknown Teacher'}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Link
                    to={`/course/${course._id}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center font-medium transition-colors"
                  >
                    View Details
                  </Link>
                  
                  {user && user.role === 'student' && (
                    <>
                      <button
                        onClick={() => handleEnrollment(course._id, enrollmentStatus[course._id])}
                        disabled={enrollmentLoading[course._id]}
                        className={`w-full px-4 py-2 rounded font-medium transition-colors ${
                          enrollmentStatus[course._id]
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {enrollmentLoading[course._id] 
                          ? 'Processing...' 
                          : enrollmentStatus[course._id] 
                            ? 'Unenroll' 
                            : 'Enroll Now'
                        }
                      </button>
                      
                      <button
                        onClick={() => handleRateClick(course)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Heart size={16} />
                        Rate Course
                      </button>
                    </>
                  )}
                  
                  {(!user || user.role !== 'student') && (
                    <div className="flex gap-2">
                      {user && user.role === 'student' && (
                        <button
                          onClick={() => handleRateClick(course)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <Heart size={14} />
                          Rate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        course={selectedCourse}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onRatingSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default Courses;
