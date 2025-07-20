import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import QuoteBanner from './components/QuoteBanner';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    const hour = new Date().getHours();
    return hour >= 19 || hour < 6; // Auto dark mode at night
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <Navbar toggleDarkMode={() => setDarkMode(!darkMode)} isDarkMode={darkMode} />
      <QuoteBanner />
      <div className="pt-4">

        <RoutesComponent />
      </div>
      <Toast />
      <Footer />
    </Router>
  );
}

export default App;