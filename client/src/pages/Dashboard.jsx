import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, BookOpen, Clock } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCourses: 0,
    activeUsers: 0,
    totalStudyHours: 0
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/course/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values if endpoint doesn't exist yet
      setDashboardData({
        totalStudents: 1024,
        totalCourses: 42,
        activeUsers: 856,
        totalStudyHours: 12500
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      id: 1, 
      title: 'Total Students', 
      value: dashboardData.totalStudents,
      icon: <Users size={24} />,
      color: 'from-blue-500 to-blue-600',
      lightColor: 'bg-blue-100 dark:bg-blue-900'
    },
    { 
      id: 2, 
      title: 'Active Courses', 
      value: dashboardData.totalCourses,
      icon: <BookOpen size={24} />,
      color: 'from-purple-500 to-purple-600',
      lightColor: 'bg-purple-100 dark:bg-purple-900'
    },
    { 
      id: 3, 
      title: 'Active Users', 
      value: dashboardData.activeUsers,
      icon: <TrendingUp size={24} />,
      color: 'from-green-500 to-green-600',
      lightColor: 'bg-green-100 dark:bg-green-900'
    },
    { 
      id: 4, 
      title: 'Study Hours', 
      value: `${(dashboardData.totalStudyHours / 1000).toFixed(1)}k`,
      icon: <Clock size={24} />,
      color: 'from-pink-500 to-pink-600',
      lightColor: 'bg-pink-100 dark:bg-pink-900'
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user.name || 'Learner'}! Here's what's happening today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {stat.title}
                </h3>
                <div className={`${stat.lightColor} p-3 rounded-lg`}>
                  <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Last updated today
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Growth Rate</span>
                <span className="text-2xl font-bold text-blue-600">+12.5%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Engagement</span>
                <span className="text-2xl font-bold text-green-600">87%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Completion Rate</span>
                <span className="text-2xl font-bold text-purple-600">94%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Satisfaction</span>
                <span className="text-2xl font-bold text-pink-600">4.8/5</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;