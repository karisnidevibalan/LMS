import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, BookOpen, Users, Star, User, LogOut, BarChart3, FileText, GraduationCap, Home, LayoutDashboard } from 'lucide-react';
import axios from 'axios';

const EnhancedNavbar = ({ toggleDarkMode, isDarkMode }) => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          // Update localStorage to keep it in sync
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    fetchUser();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full top-0 z-50 bg-gradient-to-r from-[#fef9c3] via-[#fcd5ce] to-[#e0bbf9] text-[#4b006e] dark:from-[#312e81] dark:to-[#1e1b4b] dark:text-gray-300 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-[#4b5563] dark:text-[#e5e7eb] hover:text-[#2d1b69] dark:hover:text-white transition-colors">
            LMS Platform
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Home Link */}
                <Link
                  to="/"
                  className={`flex items-center space-x-1 hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                    isActive('/') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                  }`}
                >
                  <Home size={18} />
                  <span>Home</span>
                </Link>

                {/* Common Links */}
                <Link
                  to="/courses"
                  className={`flex items-center space-x-1 hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                    isActive('/courses') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                  }`}
                >
                  <BookOpen size={18} />
                  <span>Courses</span>
                </Link>

                {/* Dashboard Link - Role-based */}
                <Link
                  to={user.role === 'student' ? '/student' : '/teacher'}
                  className={`flex items-center space-x-1 hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                    isActive(user.role === 'student' ? '/student' : '/teacher') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>

                {/* Student Links */}
                {user.role === 'student' && (
                  <>
                    <Link
                      to="/student/enrolled"
                      className={`flex items-center space-x-1 hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                        isActive('/student/enrolled') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                      }`}
                    >
                      <GraduationCap size={18} />
                      <span>My Courses</span>
                    </Link>
                    <Link
                      to="/student/analytics"
                      className={`flex items-center space-x-1 hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                        isActive('/student/analytics') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                      }`}
                    >
                      <BarChart3 size={18} />
                      <span>Analytics</span>
                    </Link>
                  </>
                )}

                {/* Teacher Links */}
                {user.role === 'teacher' && (
                  <>
                    <Link
                      to="/teacher/courses"
                      className={`flex items-center space-x-1 hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                        isActive('/teacher/courses') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                      }`}
                    >
                      <BookOpen size={18} />
                      <span>My Courses</span>
                    </Link>
                    <Link
                      to="/teacher/students"
                      className={`flex items-center space-x-1 hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                        isActive('/teacher/students') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                      }`}
                    >
                      <Users size={18} />
                      <span>Students</span>
                    </Link>
                  </>
                )}

                {/* User Info & Actions */}
                <div className="flex items-center space-x-4 border-l border-gray-400 pl-4">
                  <span className="text-sm font-medium">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                    isActive('/') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/courses"
                  className={`hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                    isActive('/courses') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                  }`}
                >
                  Courses
                </Link>
                <Link
                  to="/login"
                  className={`flex items-center space-x-1 hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                    isActive('/login') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/login"
                  className={`hover:text-[#2d1b69] dark:hover:text-white transition-colors ${
                    isActive('/login') ? 'text-[#2d1b69] dark:text-white font-semibold' : ''
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`bg-[#4b006e] hover:bg-[#2d1b69] text-white px-4 py-2 rounded-lg transition-colors ${
                    isActive('/register') ? 'bg-[#2d1b69]' : ''
                  }`}
                >
                  Register
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-lg mt-2 mb-4 p-4">
            <div className="space-y-3">
              {user ? (
                <>
                  <div className="text-sm font-medium pb-2 border-b border-gray-400">
                    {user.name} ({user.role})
                  </div>
                  
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                      isActive('/') ? 'bg-white/20 font-semibold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </Link>

                  <Link
                    to="/courses"
                    className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                      isActive('/courses') ? 'bg-white/20 font-semibold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen size={18} />
                    <span>All Courses</span>
                  </Link>

                  {user.role === 'student' && (
                    <>
                      <Link
                        to="/student"
                        className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                          isActive('/student') ? 'bg-white/20 font-semibold' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/student/enrolled"
                        className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                          isActive('/student/enrolled') ? 'bg-white/20 font-semibold' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <GraduationCap size={18} />
                        <span>My Courses</span>
                      </Link>
                      <Link
                        to="/student/analytics"
                        className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                          isActive('/student/analytics') ? 'bg-white/20 font-semibold' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BarChart3 size={18} />
                        <span>Analytics</span>
                      </Link>
                    </>
                  )}

                  {user.role === 'teacher' && (
                    <>
                      <Link
                        to="/teacher"
                        className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                          isActive('/teacher') ? 'bg-white/20 font-semibold' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/teacher/courses"
                        className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                          isActive('/teacher/courses') ? 'bg-white/20 font-semibold' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BookOpen size={18} />
                        <span>My Courses</span>
                      </Link>
                      <Link
                        to="/teacher/students"
                        className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                          isActive('/teacher/students') ? 'bg-white/20 font-semibold' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users size={18} />
                        <span>Students</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors w-full text-left"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                      isActive('/') ? 'bg-white/20 font-semibold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/courses"
                    className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                      isActive('/courses') ? 'bg-white/20 font-semibold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen size={18} />
                    <span>Courses</span>
                  </Link>
                  <Link
                    to="/login"
                    className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                      isActive('/login') ? 'bg-white/20 font-semibold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className={`flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors ${
                      isActive('/register') ? 'bg-white/20 font-semibold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Star size={18} />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EnhancedNavbar;
