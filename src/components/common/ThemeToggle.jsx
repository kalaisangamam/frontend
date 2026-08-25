import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext.jsx';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-parchment-300/30 text-parchment-100 transition-colors duration-200 hover:border-brass-500 hover:text-brass-400 focus-visible:border-brass-500 focus-visible:text-brass-400 ${className}`}
    >
      {isLight ? <FiMoon /> : <FiSun />}
    </button>
  );
};

export default ThemeToggle;
