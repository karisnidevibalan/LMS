import React from 'react';

const FancyButton = ({ children, onClick, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg transition-transform hover:scale-105"
  >
    {children}
  </button>
);

export default FancyButton;