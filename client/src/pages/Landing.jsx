import React from 'react';
import { motion } from 'framer-motion';
import FancyButton from '../components/FancyButton';
import QuoteBanner from '../components/QuoteBanner';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-2 mt-2 text-center">
      <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-4xl md:text-6xl font-bold mb-4">
        Empower Your <span className="text-rose-400">Learning</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }} className="text-lg md:text-xl text-white max-w-xl mb-6">
        A platform built to accelerate growth, connect with mentors, and enable real-world skills.
      </motion.p>
      <QuoteBanner />
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
        <FancyButton>Explore Courses</FancyButton>
      </motion.div>

      {/* Feature Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        <div className="bg-white text-black p-6 rounded-lg shadow-lg animate-fade">
          <h3 className="text-xl font-semibold mb-2">Learn Anywhere</h3>
          <p>Access your courses and mentorship from any device, at your pace.</p>
        </div>
        <div className="bg-white text-black p-6 rounded-lg shadow-lg animate-fade">
          <h3 className="text-xl font-semibold mb-2">Expert Mentors</h3>
          <p>Connect with experienced professionals ready to guide your journey.</p>
        </div>
        <div className="bg-white text-black p-6 rounded-lg shadow-lg animate-fade">
          <h3 className="text-xl font-semibold mb-2">Certification</h3>
          <p>Earn verified certifications to boost your resume and career.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
