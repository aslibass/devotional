import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants/themes';
import { Sun, Moon, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onReturnHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReturnHome }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <motion.header
      className="fixed w-full z-20 glass-strong shadow-glass-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title Section */}
          <div className="flex items-center gap-4">
            {/* Home Button */}
            {onReturnHome && (
              <motion.button
                onClick={onReturnHome}
                className="p-2 rounded-full glass-subtle shadow-glass transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Return to home"
              >
                <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </motion.button>
            )}

            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.01 }}
            >
              <h1 className="font-serif text-lg md:text-xl tracking-wide">
                <span
                  className="font-light"
                  style={{ color: THEMES.presence.color }}
                >
                  Presence
                </span>
                <span className={`mx-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  |
                </span>
                <span
                  className="font-light"
                  style={{ color: THEMES.healing.color }}
                >
                  Healing
                </span>
                <span className={`mx-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  |
                </span>
                <span
                  className="font-light"
                  style={{ color: THEMES.truth.color }}
                >
                  Truth
                </span>
              </h1>
            </motion.div>
          </div>

          {/* Right Section - Dark Mode Toggle */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full glass-subtle shadow-glass transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;