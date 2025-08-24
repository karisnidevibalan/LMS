import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, TrendingUp, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    totalRatings: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch user profile
        const userResponse = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data);

        // Fetch enrolled courses
        const coursesResponse = await axios.get('http://localhost:5000/api/course/enrolled', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrolledCourses(coursesResponse.data.slice(0, 3)); // Show only first 3 for overview

        // Calculate stats
        setStats({
          totalEnrolled: coursesResponse.data.length,
          totalRatings: coursesResponse.data.reduce((acc, course) => {
            return acc + (course.ratings?.filter(rating => rating.user === userResponse.data._id).length || 0);
          }, 0),
          recentActivity: coursesResponse.data.filter(course => {
            const enrollDate = new Date(course.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return enrollDate > weekAgo;
          }).length
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name || 'Student'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Continue your learning journey and explore new courses
        </p>
        
        {/* Prominent Enrollment CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ready to learn something new?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Explore our comprehensive course catalog and enroll in courses that match your interests.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/courses"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  <BookOpen size={20} className="mr-2" />
                  Enroll in New Courses
                </Link>
                <Link
                  to="/student/enrolled"
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Users size={20} className="mr-2" />
                  View My Courses ({stats.totalEnrolled})
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl opacity-20">🎓</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <BookOpen className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEnrolled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <Star className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ratings Given</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRatings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <TrendingUp className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recent Activity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recentActivity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/courses"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-6 rounded-lg transition-all duration-300 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <BookOpen className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={28} />
          <p className="font-bold text-lg">Enroll New Courses</p>
          <p className="text-sm opacity-90 mt-1">Discover amazing courses</p>
        </Link>

        <Link
          to="/student/enrolled"
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-6 rounded-lg transition-all duration-300 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Users className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={28} />
          <p className="font-bold text-lg">My Enrolled Courses</p>
          <p className="text-sm opacity-90 mt-1">{stats.totalEnrolled} courses enrolled</p>
        </Link>

        <Link
          to="/courses"
          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white p-6 rounded-lg transition-all duration-300 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Star className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={28} />
          <p className="font-bold text-lg">Rate & Review</p>
          <p className="text-sm opacity-90 mt-1">Share your feedback</p>
        </Link>

        <Link
          to="/student/progress"
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-6 rounded-lg transition-all duration-300 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <TrendingUp className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={28} />
          <p className="font-bold text-lg">Track Progress</p>
          <p className="text-sm opacity-90 mt-1">Monitor your learning</p>
        </Link>
      </div>

      {/* Recently Enrolled Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recently Enrolled Courses
          </h2>
          <Link
            to="/student/enrolled"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
          >
            View All
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
              You haven't enrolled in any courses yet
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start your learning journey by enrolling in your first course!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/courses"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                <BookOpen size={20} className="mr-2" />
                Enroll in Your First Course
              </Link>
              <Link
                to="/courses"
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                Browse Course Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map(course => (
              <div
                key={course._id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  {course.thumbnail && (
                    <img
                      src={`http://localhost:5000/uploads/${course.thumbnail}`}
                      alt={course.title}
                      className="w-12 h-12 object-cover rounded-lg mr-4"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      By {course.teacher?.name || 'Unknown Teacher'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/course/${course._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm transition-colors"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Browse New Courses Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            🌟 Discover New Courses
          </h2>
          <Link
            to="/courses"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium inline-flex items-center"
          >
            View All Courses
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl mb-2">💻</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Programming</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Learn coding skills</p>
            <Link
              to="/courses?category=programming"
              className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
            >
              Explore Programming →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Design</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Creative design courses</p>
            <Link
              to="/courses?category=design"
              className="text-green-600 dark:text-green-400 text-sm font-medium hover:underline"
            >
              Explore Design →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl mb-2">💼</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Business</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Business & marketing</p>
            <Link
              to="/courses?category=business"
              className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline"
            >
              Explore Business →
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/courses"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <BookOpen size={20} className="mr-2" />
            Browse All Courses & Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
