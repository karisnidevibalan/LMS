// src/components/pages/CourseDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BookOpen, Clock, Download } from 'lucide-react';
import { cachedGet, apiPost, clearCachePattern } from '../utils/api';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [studyMaterials, setStudyMaterials] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Always fetch course details, and conditionally prepare other requests
        const requests = [
          cachedGet(`/course/${id}`, 'course', 10 * 60 * 1000)
        ];
        
        // Add enrolled courses request if user is authenticated
        if (token) {
          requests.push(
            cachedGet('/course/enrolled', 'enrollment', 2 * 60 * 1000, {
              headers: { Authorization: `Bearer ${token}` }
            })
          );
        }
        
        // Execute requests in parallel
        const responses = await Promise.all(requests);
        const courseResponse = responses[0];
        setCourse(courseResponse.data);
        
        // Handle enrollment check if user is authenticated
        if (token && responses[1]) {
          const enrolledResponse = responses[1];
          const enrolledCourses = enrolledResponse.data;
          const alreadyEnrolled = enrolledCourses.some(enrolledCourse => enrolledCourse._id === id);
          setIsEnrolled(alreadyEnrolled);
          
          // Check if user is teacher of this course
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const isTeacher = currentUser.role === 'teacher' && 
                           (courseResponse.data.teacherId === currentUser._id || 
                            courseResponse.data.teacherId.toString() === currentUser._id);
          
          console.log('Enrollment check:', {
            alreadyEnrolled,
            isTeacher,
            currentUserRole: currentUser.role,
            currentUserId: currentUser._id,
            courseTeacherId: courseResponse.data.teacherId,
            shouldFetchMaterials: alreadyEnrolled || isTeacher
          });
          
          // Only fetch materials if enrolled OR if user is the teacher
          if (alreadyEnrolled || isTeacher) {
            try {
              console.log('User has access, fetching study materials...');
              const materialsResponse = await cachedGet(`/study-materials/course/${id}`);
              setStudyMaterials(materialsResponse.data);
              console.log('Study materials loaded successfully');
            } catch (materialError) {
              console.error('Error fetching study materials:', materialError);
              // For any error, just set empty materials
              setStudyMaterials([]);
            }
          } else {
            console.log('User not enrolled and not teacher, skipping materials fetch');
            setStudyMaterials([]);
          }
        } else if (token) {
          // User is authenticated but enrollment check failed
          console.log('User authenticated but no enrollment data available');
          setStudyMaterials([]);
        } else {
          // User not authenticated
          console.log('User not authenticated, skipping materials fetch');
          setStudyMaterials([]);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to enroll in courses');
        navigate('/login');
        return;
      }

      await apiPost(`/course/${id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear enrollment cache to refresh data
      clearCachePattern('enrollment');
      clearCachePattern('course');

      toast.success('Successfully enrolled!');
      setIsEnrolled(true);
      navigate('/student/enrolled');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error(error.response?.data?.error || 'Failed to enroll in course');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl mb-2">Error loading course</p>
          <p>{error || 'Course not found'}</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-20 pb-10 bg-gradient-to-br from-[#fcd5ce] via-[#fae1dd] to-[#f9c5d1] dark:from-[#1e1b4b] dark:to-[#312e81]">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#2d2a4a] p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-200 mb-4">{course.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{course.description}</p>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Category:</strong> {course.category || 'General'}</p>
          <p><strong>Level:</strong> {course.level || 'Beginner'}</p>
          {course.teacherId && (
            <p><strong>Instructor:</strong> {course.teacherId.name || 'Unknown Teacher'}</p>
          )}
          {course.price && (
            <p><strong>Price:</strong> ${course.price}</p>
          )}
          {course.enrolledStudents && (
            <p><strong>Enrolled Students:</strong> {course.enrolledStudents.length}</p>
          )}
        </div>

        {/* Study Materials Section - Only show if enrolled */}
        {isEnrolled && studyMaterials.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
              <BookOpen size={20} />
              Study Materials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studyMaterials.slice(0, 4).map((material) => (
                <Link
                  key={material._id}
                  to={`/course/${id}/materials/${material._id}/study`}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-200 dark:border-blue-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                        {material.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {material.chapter || 'General'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          material.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          material.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {material.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          {material.estimatedStudyTime}min
                        </span>
                      </div>
                    </div>
                    <Download size={16} className="text-blue-600" />
                  </div>
                </Link>
              ))}
            </div>
            {studyMaterials.length > 4 && (
              <div className="mt-3 text-center">
                <Link
                  to={`/course/${id}/materials`}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  View all {studyMaterials.length} materials →
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          {isEnrolled ? (
            <div className="flex flex-col gap-2">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center">
                ✅ Already Enrolled
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/student/enrolled')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  View My Courses
                </button>
                <Link
                  to={`/course/${id}/materials`}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <BookOpen size={16} />
                  Study Materials
                </Link>
              </div>
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Enroll Now
            </button>
          )}

          <button
            onClick={() => navigate(`/rate/${course._id}`)}
            className="bg-gray-200 dark:bg-gray-700 dark:text-white px-4 py-2 rounded hover:opacity-90 transition"
          >
            Rate this Course
          </button>
          
          <button
            onClick={() => navigate('/courses')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
