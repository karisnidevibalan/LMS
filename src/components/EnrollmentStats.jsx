import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, BookOpen, Star } from 'lucide-react';
import axios from 'axios';

const EnrollmentStats = ({ userRole, userId }) => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledStudents: 0,
    averageRating: 0,
    enrolledCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        if (userRole === 'teacher') {
          // Fetch teacher statistics
          const coursesResponse = await axios.get('http://localhost:5000/api/course/my-courses', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const courses = coursesResponse.data;
          const totalStudents = courses.reduce((sum, course) => sum + (course.studentsEnrolled?.length || 0), 0);
          const totalRatings = courses.reduce((sum, course) => sum + (course.averageRating || 0), 0);
          const avgRating = courses.length > 0 ? totalRatings / courses.length : 0;

          setStats({
            totalCourses: courses.length,
            enrolledStudents: totalStudents,
            averageRating: avgRating,
            enrolledCourses: 0
          });
        } else if (userRole === 'student') {
          // Fetch student statistics
          const enrolledResponse = await axios.get('http://localhost:5000/api/course/enrolled', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setStats({
            totalCourses: 0,
            enrolledStudents: 0,
            averageRating: 0,
            enrolledCourses: enrolledResponse.data.length
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole && userId) {
      fetchStats();
    }
  }, [userRole, userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = userRole === 'teacher' 
    ? [
        { icon: BookOpen, label: 'My Courses', value: stats.totalCourses, color: 'blue' },
        { icon: Users, label: 'Total Students', value: stats.enrolledStudents, color: 'green' },
        { icon: Star, label: 'Avg Rating', value: stats.averageRating.toFixed(1), color: 'yellow' },
        { icon: TrendingUp, label: 'Growth', value: '+12%', color: 'purple' }
      ]
    : [
        { icon: BookOpen, label: 'Enrolled Courses', value: stats.enrolledCourses, color: 'blue' },
        { icon: Users, label: 'Classmates', value: '45+', color: 'green' },
        { icon: Star, label: 'My Ratings', value: '8', color: 'yellow' },
        { icon: TrendingUp, label: 'Progress', value: '75%', color: 'purple' }
      ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
            <Icon 
              size={24} 
              className={`text-${color}-500`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnrollmentStats;
