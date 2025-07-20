import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { id: 1, title: 'Total Students', value: '1,024' },
  { id: 2, title: 'Courses', value: '42' },
  { id: 3, title: 'Mentors', value: '15' },
];

const Dashboard = () => {
  return (
    <div className="p-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          className="bg-white text-black p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
        >
          <h4 className="text-lg font-semibold mb-2">{stat.title}</h4>
          <p className="text-2xl font-bold">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default Dashboard;