import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants/themes';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onReturnHome?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onReturnHome }) => {
  const { currentDay, isDarkMode } = useTheme();
  const theme = THEMES[currentDay];

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 ease-in-out ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
      style={{ 
        backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
      }}
    >
      <Header onReturnHome={onReturnHome} />
      
      <main className="container mx-auto px-4 pb-16 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;