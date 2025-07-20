import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

const Navbar = ({ toggleDarkMode, isDarkMode }) => (
 <nav className="fixed w-full top-0 z-50 bg-gradient-to-r from-[#fef9c3] via-[#fcd5ce] to-[#e0bbf9] text-[#4b006e] dark:from-[#312e81] dark:to-[#1e1b4b] dark:text-gray-300 p-4 shadow-md">

    <div className="container mx-auto flex justify-between items-center">
      <span className="text-xl font-italic text-[#4b5563] dark:text-[#e5e7eb]">
  Learning Management System
</span>

      <div className="flex items-center space-x-4">
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/register" className="hover:underline">Register</Link>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-white/10 transition"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;