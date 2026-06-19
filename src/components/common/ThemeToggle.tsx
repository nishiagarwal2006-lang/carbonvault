import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Contrast } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { isDark, isHighContrast, toggleTheme, toggleHighContrast } = useTheme();

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Theme controls">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-dark-100 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <button
        onClick={toggleHighContrast}
        className={`p-2 rounded-lg transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center ${
          isHighContrast ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-dark-100'
        }`}
        aria-label={isHighContrast ? 'Disable high contrast' : 'Enable high contrast'}
      >
        <Contrast className="w-5 h-5" />
      </button>
    </div>
  );
};