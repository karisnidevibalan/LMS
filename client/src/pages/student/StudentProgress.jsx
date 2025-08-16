import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BookOpen, Star, Calendar, Clock, Award, Target, BarChart3 } from 'lucide-react';
import axios from 'axios';

const StudentProgress = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progressStats, setProgressStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    averageRating: 0,
    certificatesEarned: 0,
    streak: 0
  });
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [activityStats, setActivityStats] = useState({
    activeDays: 0,
    totalDays: 7
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const generateWeeklyActivity = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const currentDayIndex = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
    
    const weekActivity = days.map((day, index) => {
      const isPastOrToday = index <= currentDayIndex;
      let isActive = false;
      let activityCount = 0;
      
      if (isPastOrToday) {
        // Simulate activity based on various factors
        const activityProbability = Math.random();
        
        // Higher probability for recent days and weekdays
        if (index <= currentDayIndex) {
          if (index >= currentDayIndex - 2) { // Last 3 days more likely
            isActive = activityProbability > 0.2;
            activityCount = isActive ? Math.floor(Math.random() * 4) + 1 : 0;
          } else if (index < 5) { // Weekdays more likely
            isActive = activityProbability > 0.4;
            activityCount = isActive ? Math.floor(Math.random() * 3) + 1 : 0;
          } else { // Weekends less likely
            isActive = activityProbability > 0.6;
            activityCount = isActive ? Math.floor(Math.random() * 2) + 1 : 0;
          }
        }
      }
      
      return {
        day,
        isActive,
        activityCount,
        isPastOrToday
      };
    });
    
    return weekActivity;
  };

  const calculateStreak = (activity) => {
    let streak = 0;
    // Calculate from today backwards
    for (let i = activity.length - 1; i >= 0; i--) {
      if (activity[i].isActive && activity[i].isPastOrToday) {
        streak++;
      } else if (activity[i].isPastOrToday) {
        break;
      }
    }
    return streak;
  };

  const getProgressPercentage = (course) => {
    // Mock progress calculation - in real app this would come from backend
    // Use course ID to generate consistent random progress for each course
    const seed = course._id ? course._id.charCodeAt(0) : 0;
    return Math.floor((seed % 80) + 20); // Progress between 20-99%
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view your progress');
          setLoading(false);
          return;
        }

        // Fetch enrolled courses
        const response = await axios.get('http://localhost:5000/api/course/enrolled', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const courses = response.data;
        setEnrolledCourses(courses);

        // Generate weekly activity (regenerate each time for freshness)
        const activity = generateWeeklyActivity();
        setWeeklyActivity(activity);

        // Calculate activity stats
        const activeDays = activity.filter(day => day.isActive && day.isPastOrToday).length;
        const currentStreak = calculateStreak(activity);
        
        setActivityStats({
          activeDays,
          totalDays: activity.filter(day => day.isPastOrToday).length
        });

        // Calculate progress stats
        const totalCourses = courses.length;
        const completedCourses = courses.filter(course => 
          course.progress >= 100 || course.completed
        ).length;
        
        const totalHours = courses.reduce((sum, course) => 
          sum + (course.duration || 0), 0
        );

        const ratingsGiven = courses.filter(course => 
          course.ratings && course.ratings.length > 0
        ).length;

        setProgressStats({
          totalCourses,
          completedCourses,
          totalHours,
          averageRating: ratingsGiven,
          certificatesEarned: completedCourses,
          streak: currentStreak
        });

        setLastUpdated(new Date());

      } catch (error) {
        console.error('Error fetching progress data:', error);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();

    // Auto-refresh every 30 seconds if enabled
    let refreshInterval;
    if (autoRefresh) {
      refreshInterval = setInterval(fetchProgressData, 30000);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh]);

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
          <p className="text-xl mb-2">Error loading progress</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📈 My Learning Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning journey and achievements
            {lastUpdated && (
              <span className="text-sm ml-2">
                • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              window.location.reload();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            🔄 Refresh
          </button>
          
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto-refresh (30s)
          </label>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enrolled Courses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{progressStats.totalCourses}</p>
            </div>
            <BookOpen className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{progressStats.completedCourses}</p>
            </div>
            <Award className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Study Hours</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{progressStats.totalHours}</p>
            </div>
            <Clock className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{progressStats.streak} days</p>
            </div>
            <TrendingUp className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Overall Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <BarChart3 className="mr-2" size={24} />
          Overall Progress
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Completion Rate</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    {progressStats.totalCourses > 0 ? Math.round((progressStats.completedCourses / progressStats.totalCourses) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div 
                  style={{ width: `${progressStats.totalCourses > 0 ? (progressStats.completedCourses / progressStats.totalCourses) * 100 : 0}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Weekly Activity</h3>
            <div className="flex items-center space-x-1 mb-3">
              {weeklyActivity.map((dayData, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded transition-all duration-300 cursor-pointer ${
                      dayData.isActive && dayData.isPastOrToday
                        ? 'bg-green-500 hover:bg-green-600' 
                        : dayData.isPastOrToday 
                        ? 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    } flex items-center justify-center text-white text-xs font-semibold`}
                    title={`${dayData.day}: ${dayData.isPastOrToday ? (dayData.isActive ? `${dayData.activityCount} activities` : 'No activity') : 'Future day'}`}
                  >
                    {dayData.isActive && dayData.isPastOrToday ? '✓' : dayData.isPastOrToday ? '○' : ''}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{dayData.day}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activityStats.activeDays}/{activityStats.totalDays} days active this week
            </p>
            {progressStats.streak > 0 && (
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                🔥 {progressStats.streak} day streak!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Course Progress List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Target className="mr-2" size={24} />
          Course Progress
        </h2>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
              No enrolled courses to track progress
            </p>
            <Link
              to="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              Enroll in Your First Course
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map((course) => {
              const progress = getProgressPercentage(course);
              return (
                <div
                  key={course._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Instructor: {course.teacherId?.name || 'Unknown Teacher'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{progress}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3 cursor-pointer">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 hover:opacity-80 ${getProgressColor(progress)}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="mr-1" />
                      <span>Enrolled {new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/course/${course._id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
                    >
                      Continue Learning →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/student/enrolled"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View All Enrolled Courses
          </Link>
          <Link
            to="/courses"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse New Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
