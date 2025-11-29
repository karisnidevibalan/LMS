import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, TrendingUp, Clock, ArrowRight, Zap } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    studyStreak: 0,
    recentActivity: 0,
    averageRating: 0,
    totalStudyHours: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch user profile
        const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data);

        // Fetch enrolled courses
        const coursesResponse = await axios.get('http://localhost:5000/api/course/enrolled', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrolledCourses(coursesResponse.data);

        // Calculate stats
        const avgRating = coursesResponse.data.length > 0
          ? (coursesResponse.data.reduce((acc, course) => acc + (course.averageRating || 0), 0) / coursesResponse.data.length).toFixed(1)
          : 0;

        setStats({
          totalEnrolled: coursesResponse.data.length,
          studyStreak: 5,
          recentActivity: coursesResponse.data.filter(course => {
            const enrollDate = new Date(course.createdAt || Date.now());
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return enrollDate > weekAgo;
          }).length,
          averageRating: avgRating,
          totalStudyHours: (coursesResponse.data.length * 15).toFixed(1)
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Continue your learning journey and explore new courses
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
        >
          {[
            {
              icon: <BookOpen size={24} />,
              label: 'Enrolled Courses',
              value: stats.totalEnrolled,
              color: 'from-blue-500 to-blue-600',
              lightBg: 'bg-blue-100 dark:bg-blue-900'
            },
            {
              icon: <Clock size={24} />,
              label: 'Study Hours',
              value: stats.totalStudyHours,
              color: 'from-purple-500 to-purple-600',
              lightBg: 'bg-purple-100 dark:bg-purple-900'
            },
            {
              icon: <Zap size={24} />,
              label: 'Study Streak',
              value: `${stats.studyStreak} days`,
              color: 'from-amber-500 to-amber-600',
              lightBg: 'bg-amber-100 dark:bg-amber-900'
            },
            {
              icon: <Star size={24} />,
              label: 'Avg Rating',
              value: `${stats.averageRating}/5`,
              color: 'from-pink-500 to-pink-600',
              lightBg: 'bg-pink-100 dark:bg-pink-900'
            },
            {
              icon: <TrendingUp size={24} />,
              label: 'Recent Activity',
              value: `+${stats.recentActivity}`,
              color: 'from-green-500 to-green-600',
              lightBg: 'bg-green-100 dark:bg-green-900'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
            >
              <div className={`${stat.lightBg} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Banner */}
        {enrolledCourses.length < 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-12 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Expand Your Knowledge</h3>
                <p className="text-blue-100">
                  Discover more courses and accelerate your learning
                </p>
              </div>
              <Link
                to="/courses"
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Browse Courses
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Enrolled Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen size={28} />
              Your Courses
            </h2>
            {enrolledCourses.length > 3 && (
              <Link to="/student/enrolled" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                View All
              </Link>
            )}
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-12 text-center">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                You haven't enrolled in any courses yet
              </p>
              <Link
                to="/courses"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.slice(0, 6).map((course) => (
                <motion.div
                  key={course._id}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-all group overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32 group-hover:scale-110 transition-transform duration-300" />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {course.enrolledStudents?.length || 0} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400" />
                        {course.averageRating || 0}/5
                      </span>
                    </div>

                    <Link
                      to={`/course/${course._id}/materials`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <BookOpen size={16} />
                      View Materials
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
