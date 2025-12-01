import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Users, Award, Brain, MessageSquare, BarChart3, 
  Sparkles, Clock, Target, Zap, Globe, Shield,
  ChevronRight, Play, CheckCircle2, GraduationCap, 
  LayoutDashboard, TrendingUp, Presentation, UserCircle
} from 'lucide-react';
import FancyButton from '../components/FancyButton';
import QuoteBanner from '../components/QuoteBanner';
import axios from 'axios';

const Landing = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Learn Anywhere",
      description: "Access your courses and mentorship from any device, at your pace.",
      color: "from-blue-400 to-blue-600",
      link: "/courses"
    },
    {
      icon: Users,
      title: "Expert Mentors",
      description: "Connect with experienced professionals ready to guide your journey.",
      color: "from-purple-400 to-purple-600",
      link: "/courses"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Earn verified certifications to boost your resume and career.",
      color: "from-pink-400 to-pink-600",
      link: "/courses"
    }
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Study Materials",
      description: "Generate personalized study content with keyword extraction and adaptive learning.",
      color: "bg-gradient-to-br from-indigo-500 to-purple-600"
    },
    {
      icon: MessageSquare,
      title: "Character-Based Learning",
      description: "Learn with your favorite characters like Sherlock Holmes, Tony Stark, or Dumbledore!",
      color: "bg-gradient-to-br from-emerald-500 to-teal-600"
    },
    {
      icon: Sparkles,
      title: "Voice Narration",
      description: "Listen to AI-generated narrations in multiple languages with character voices.",
      color: "bg-gradient-to-br from-amber-500 to-orange-600"
    },
    {
      icon: BarChart3,
      title: "Learning Analytics",
      description: "Track your progress, study patterns, and character preferences with detailed insights.",
      color: "bg-gradient-to-br from-rose-500 to-red-600"
    }
  ];

  const stats = [
    { label: "Active Learners", value: "10K+", icon: Users },
    { label: "Course Hours", value: "50K+", icon: Clock },
    { label: "Success Rate", value: "95%", icon: Target },
    { label: "AI Characters", value: "15+", icon: Sparkles }
  ];

  const benefits = [
    "Interactive quizzes and assessments",
    "Real-time progress tracking",
    "Multi-language support",
    "Personalized learning paths",
    "Community discussions",
    "Mobile-friendly interface"
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col justify-center items-center px-4 md:px-8 text-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8 relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-2xl">
            Empower Your <span className="text-rose-400">Learning</span>
          </h1>
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-400/30 rounded-full px-6 py-2 backdrop-blur-sm">
            <Zap className="w-5 h-5 text-rose-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-rose-300">Powered by AI</span>
            <Zap className="w-5 h-5 text-rose-400" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-2xl text-white max-w-3xl mb-6 drop-shadow-lg relative z-10"
        >
          A platform built to accelerate growth, connect with mentors, and enable real-world skills
          <span className="text-rose-300 font-bold"> with AI-powered learning companions</span>.
        </motion.p>

        <QuoteBanner />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mt-4 relative z-10"
        >
          <FancyButton onClick={() => navigate('/courses')}>
            <BookOpen className="w-5 h-5 mr-2" />
            Explore Courses
          </FancyButton>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-white/20 hover:bg-white/30 border-2 border-white/50 text-white rounded-full font-bold transition-all duration-300 flex items-center justify-center backdrop-blur-md shadow-xl hover:shadow-2xl"
          >
            Get Started Free
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl w-full relative z-10"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border-2 border-white/30 rounded-2xl p-6 text-center shadow-xl"
            >
              <stat.icon className="w-10 h-10 mx-auto mb-3 text-rose-400 drop-shadow-lg" />
              <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-100">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Quick Navigation Section */}
      {user && (
        <div className="py-16 px-4 md:px-8 bg-gradient-to-b from-purple-900/30 via-black/20 to-transparent border-y border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-lg">
                Welcome Back, <span className="text-rose-400">{user.name}!</span>
              </h2>
              <p className="text-gray-100 text-lg font-medium">
                Quick access to all your learning tools
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.role === 'student' ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/student')}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl p-6 text-center shadow-lg shadow-blue-500/30 transition-all duration-300"
                  >
                    <LayoutDashboard className="w-10 h-10 mx-auto mb-3 text-white" />
                    <div className="text-white font-semibold text-lg mb-1">Dashboard</div>
                    <div className="text-blue-100 text-sm">Your overview</div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/student/enrolled')}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl p-6 text-center shadow-lg shadow-purple-500/30 transition-all duration-300"
                  >
                    <GraduationCap className="w-10 h-10 mx-auto mb-3 text-white" />
                    <div className="text-white font-semibold text-lg mb-1">My Courses</div>
                    <div className="text-purple-100 text-sm">Enrolled courses</div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/student/analytics')}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-2xl p-6 text-center shadow-lg shadow-emerald-500/30 transition-all duration-300"
                  >
                    <BarChart3 className="w-10 h-10 mx-auto mb-3 text-white" />
                    <div className="text-white font-semibold text-lg mb-1">Analytics</div>
                    <div className="text-emerald-100 text-sm">Track progress</div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/courses')}
                    className="bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-2xl p-6 text-center shadow-lg shadow-rose-500/30 transition-all duration-300"
                  >
                    <BookOpen className="w-10 h-10 mx-auto mb-3 text-white" />
                    <div className="text-white font-semibold text-lg mb-1">All Courses</div>
                    <div className="text-rose-100 text-sm">Browse catalog</div>
                  </motion.button>
                </>
              ) : user.role === 'teacher' ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/teacher')}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl p-6 text-center shadow-lg shadow-blue-500/30 transition-all duration-300"
                  >
                    <LayoutDashboard className="w-10 h-10 mx-auto mb-3 text-white" />
                    <div className="text-white font-semibold text-lg mb-1">Dashboard</div>
                    <div className="text-blue-100 text-sm">Your overview</div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/teacher/courses')}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl p-6 text-center shadow-lg shadow-purple-500/30 transition-all duration-300"
                  >
                    <Presentation className="w-10 h-10 mx-auto mb-3 text-white" />
                    <div className="text-white font-semibold text-lg mb-1">My Courses</div>
                    <div className="text-purple-100 text-sm">Manage courses</div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/teacher/students')}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-2xl p-6 text-center shadow-lg shadow-emerald-500/30 transition-all duration-300"
                  >
                    <Users className="w-10 h-10 mx-auto mb-3 text-white" />
                    <div className="text-white font-semibold text-lg mb-1">Students</div>
                    <div className="text-emerald-100 text-sm">View students</div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/courses')}
                    className="bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-2xl p-6 text-center shadow-lg shadow-rose-500/30 transition-all duration-300"
                  >
                    <BookOpen className="w-10 h-10 mx-auto mb-3 text-white" />
                    <div className="text-white font-semibold text-lg mb-1">All Courses</div>
                    <div className="text-rose-100 text-sm">Browse catalog</div>
                  </motion.button>
                </>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}

      {/* Core Features Section */}
      <div className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent via-blue-900/10 to-purple-900/20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
              Why Choose <span className="text-rose-400">Our Platform?</span>
            </h2>
            <p className="text-gray-100 text-lg max-w-2xl mx-auto font-medium">
              Everything you need to succeed in your learning journey, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => navigate(feature.link)}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg border-2 border-white/20 rounded-3xl p-8 cursor-pointer group relative overflow-hidden shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-lg">{feature.title}</h3>
                <p className="text-gray-100 leading-relaxed mb-4 font-medium">{feature.description}</p>
                <div className="flex items-center text-rose-400 font-bold group-hover:translate-x-2 transition-transform duration-300">
                  Learn More <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Features Section */}
      <div className="py-20 px-4 md:px-8 bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-transparent border-y border-white/10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50 rounded-full px-6 py-3 mb-6 backdrop-blur-sm shadow-lg">
              <Brain className="w-6 h-6 text-purple-300" />
              <span className="text-purple-200 font-bold text-lg">AI-Powered Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
              Learn with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">AI Companions</span>
            </h2>
            <p className="text-gray-100 text-lg max-w-2xl mx-auto font-medium">
              Experience the future of education with our cutting-edge AI technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg border-2 border-white/20 rounded-3xl p-8 group shadow-xl"
              >
                <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-lg">{feature.title}</h3>
                <p className="text-gray-100 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent via-blue-900/10 to-purple-900/20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
              Everything You Need to <span className="text-rose-400">Succeed</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-colors duration-300 shadow-lg"
              >
                <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0 drop-shadow-lg" />
                <span className="text-white text-lg font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 md:px-8 bg-gradient-to-b from-purple-900/20 to-transparent">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-rose-600/30 via-purple-600/30 to-blue-600/30 border-2 border-white/30 rounded-3xl p-12 text-center backdrop-blur-lg shadow-2xl"
        >
          <Sparkles className="w-20 h-20 mx-auto mb-6 text-rose-400 drop-shadow-2xl" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-gray-100 text-lg mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
            Join thousands of learners who are already experiencing the future of education with AI-powered study companions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full font-bold text-lg text-white transition-all duration-300 flex items-center justify-center shadow-2xl shadow-rose-500/50 hover:shadow-rose-600/60 border-2 border-rose-400/50"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Learning Now
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="px-10 py-4 bg-white/20 hover:bg-white/30 border-2 border-white/50 text-white rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-md shadow-xl"
            >
              Browse Courses
            </button>
          </div>
        </motion.div>
      </div>

      {/* Trust Badge */}
      <div className="py-12 px-4 border-t-2 border-white/20 bg-black/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 text-gray-100">
          <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full border border-white/20 backdrop-blur-sm">
            <Shield className="w-6 h-6 text-emerald-400" />
            <span className="font-semibold">Secure & Private</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/30" />
          <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full border border-white/20 backdrop-blur-sm">
            <Globe className="w-6 h-6 text-blue-400" />
            <span className="font-semibold">Global Access</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/30" />
          <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full border border-white/20 backdrop-blur-sm">
            <Award className="w-6 h-6 text-rose-400" />
            <span className="font-semibold">Certified Content</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
