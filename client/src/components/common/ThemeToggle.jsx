import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 text-sub hover:text-main transition-colors rounded-lg hover:bg-surface-hover flex items-center justify-center ${className}`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-amber-400 hover:text-amber-500 transition-colors" />
      ) : (
        <Moon size={20} className="text-sub hover:text-main transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;

