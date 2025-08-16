module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        danger: '#ef4444',
        success: '#10b981'
      },
      backgroundImage: {
        gradient: 'linear-gradient(to right, #7F00FF, #E100FF)',
        fancy: 'radial-gradient(circle at top left, #6366f1, #8b5cf6, #ec4899)'
      },
      animation: {
        fade: 'fadeIn 1.5s ease-in-out',
        shake: 'shake 0.5s ease-in-out',
        'gradient-x': 'gradient-x 5s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
