import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants/themes';
import { Sun, Moon, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onReturnHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReturnHome }) => {
  const { currentDay, isDarkMode, toggleDarkMode } = useTheme();
  const theme = THEMES[currentDay];

  return (
    <motion.header 
      className="fixed w-full z-20 transition-all duration-500"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ 
        backgroundColor: isDarkMode 
          ? `rgba(17, 24, 39, 0.95)`
          : `rgba(255, 255, 255, 0.95)`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`
      }}
    >
      <div className="container mx-auto px-6 py-4 md:py-5">
        <div className="flex items-center justify-between">
          {/* Logo/Title Section */}
          <motion.div className="flex items-center gap-4">
            {/* Home Icon Button */}
            <motion.button
              onClick={onReturnHome}
              className="p-2 rounded-full transition-all duration-300 group relative"
              style={{ 
                backgroundColor: isDarkMode 
                  ? 'rgba(255,255,255,0.06)' 
                  : 'rgba(0,0,0,0.04)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
              }}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' 
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Return to start"
            >
              <Home size={18} style={{ color: theme.color }} />
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Return to start
              </div>
            </motion.button>

            {/* Main Title */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.01 }}
            >
              <h1 className="font-serif text-xl md:text-2xl tracking-wide relative">
                <span 
                  className="font-light"
                  style={{ color: THEMES.presence.color }}
                >
                  Presence
                </span>
                <span className="mx-2 opacity-40 text-sm">•</span>
                <span 
                  className="font-light"
                  style={{ color: THEMES.healing.color }}
                >
                  Healing
                </span>
                <span className="mx-2 opacity-40 text-sm">•</span>
                <span 
                  className="font-light"
                  style={{ color: THEMES.truth.color }}
                >
                  Truth
                </span>
              </h1>
              
              {/* Subtle underline animation */}
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-px origin-left"
                style={{ 
                  background: `linear-gradient(90deg, ${THEMES.presence.color}, ${THEMES.healing.color}, ${THEMES.truth.color})`,
                  opacity: 0.3
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>
          
          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* Current Theme Indicator */}
            <motion.div 
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
              style={{ 
                backgroundColor: isDarkMode 
                  ? `${theme.color}15` 
                  : `${theme.color}10`,
                border: `1px solid ${theme.color}30`
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.color }}
              />
              <span 
                className="font-medium"
                style={{ color: theme.color }}
              >
                {theme.name}
              </span>
            </motion.div>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full transition-all duration-300 relative group"
              style={{ 
                backgroundColor: isDarkMode 
                  ? 'rgba(255,255,255,0.06)' 
                  : 'rgba(0,0,0,0.04)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
              }}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' 
              }}
              whileTap={{ scale: 0.95 }}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDarkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDarkMode ? (
                  <Sun size={18} style={{ color: theme.color }} />
                ) : (
                  <Moon size={18} style={{ color: theme.color }} />
                )}
              </motion.div>
              
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {isDarkMode ? "Light mode" : "Dark mode"}
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;