import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Zap, Award, Volume2, BookOpen, Target, Calendar } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const StudentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/analytics/student/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">No analytics data available</p>
      </div>
    );
  }

  // Prepare chart data
  const characterData = Object.entries(analytics.characterStats).map(([name, count]) => ({
    name,
    sessions: count
  }));

  const modeData = Object.entries(analytics.modeStats).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    sessions: count
  }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Learning Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and study patterns
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Sessions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalSessions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <Clock className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Study Time</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.floor(analytics.totalStudyTime / 60)}h {analytics.totalStudyTime % 60}m
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg">
                <Zap className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Study Streak</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.studyStreak} days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-lg">
                <Award className="text-pink-600 dark:text-pink-400" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Performance</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.averagePerformance}%</p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Character Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Volume2 size={24} />
              Character Usage
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={characterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Favorite Character:</span> {analytics.favoriteCharacter}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                <span className="font-semibold">Narration Usage:</span> {analytics.narrationUsageRate}% of sessions
              </p>
            </div>
          </motion.div>

          {/* Study Mode Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={24} />
              Study Mode Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={modeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sessions"
                >
                  {modeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Preferred Mode:</span> {analytics.preferredMode}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                <span className="font-semibold">Avg Completion:</span> {analytics.averageCompletion}%
              </p>
            </div>
          </motion.div>
        </div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar size={24} />
            Recent Study Sessions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Material</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Character</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Time</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentSessions.map((session, index) => (
                  <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {session.material?.title || 'Unknown Material'}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {session.characterUsed || 'None'}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {session.timeSpent} min
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {new Date(session.startedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
