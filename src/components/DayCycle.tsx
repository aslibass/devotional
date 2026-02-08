import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants/themes';
import { Day } from '../types';

const DayCycle: React.FC = () => {
  const { currentDay, setCurrentDay } = useTheme();
  const mainThemes: Day[] = ['presence', 'healing', 'truth'];
  
  return (
    <div className="mb-12 md:mb-16">
      <motion.h2 
        className="font-serif text-xl md:text-2xl mb-6 text-center opacity-90"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Choose Your Focus
      </motion.h2>
      
      <motion.div 
        className="flex justify-center space-x-3 md:space-x-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {mainThemes.map((day) => (
          <DayButton 
            key={day} 
            day={day} 
            isActive={currentDay === day} 
            onClick={() => setCurrentDay(day)} 
          />
        ))}
      </motion.div>
    </div>
  );
};

interface DayButtonProps {
  day: Day;
  isActive: boolean;
  onClick: () => void;
}

const DayButton: React.FC<DayButtonProps> = ({ day, isActive, onClick }) => {
  const theme = THEMES[day];
  
  return (
    <motion.button
      onClick={onClick}
      className="relative py-3 px-6 md:px-8 rounded-full font-serif transition-all duration-300 text-lg md:text-xl"
      style={{
        backgroundColor: isActive ? theme.color : 'transparent',
        color: isActive ? 'white' : theme.color,
        border: `2px solid ${theme.color}`,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: theme.color }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      )}
      <span className="relative z-10">
        {theme.name}
      </span>
    </motion.button>
  );
};

export default DayCycle;