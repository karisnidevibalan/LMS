import React from 'react';

const Footer = () => (
  <footer className="bg-gradient-to-r from-[#fef9c3] via-[#fcd5ce] to-[#e0bbf9] text-[#4b006e] dark:from-[#312e81] dark:to-[#1e1b4b] dark:text-gray-300 text-center py-4 mt-2 text-sm">
    © {new Date().getFullYear()} LMS. All rights reserved.
  </footer>
);

export default Footer;