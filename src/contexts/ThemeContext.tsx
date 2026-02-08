import React, { createContext, useContext, useState, useEffect } from 'react';
import { Day } from '../types';
import { DAY_CYCLE } from '../constants/themes';
import { getTotalDaysForTheme } from '../utils/devotionalService';

interface ThemeContextType {
  currentDay: Day;
  isDarkMode: boolean;
  dayNumber: number;
  toggleDarkMode: () => void;
  setCurrentDay: (day: Day) => void;
  setDayNumber: (day: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDay, setCurrentDay] = useState<Day>(() => {
    const savedDay = localStorage.getItem('currentDay');
    if (savedDay && DAY_CYCLE.includes(savedDay as Day)) {
      return savedDay as Day;
    }
    return DAY_CYCLE[0];
  });

  const [dayNumber, setDayNumber] = useState(() => {
    // Get the current day of the month
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    
    // Get the total number of days for the current theme
    const totalDays = getTotalDaysForTheme(currentDay);
    
    // If the day of month is greater than the total days,
    // wrap around using modulo (but avoid 0)
    const adjustedDay = ((dayOfMonth - 1) % totalDays) + 1;
    
    // Check if there's a saved day number
    const savedDayNumber = localStorage.getItem('dayNumber');
    const parsedDayNumber = savedDayNumber ? parseInt(savedDayNumber, 10) : adjustedDay;
    
    // Ensure the day number is within valid bounds
    return parsedDayNumber > 0 && parsedDayNumber <= totalDays ? parsedDayNumber : adjustedDay;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode 
      ? savedMode === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('currentDay', currentDay);
  }, [currentDay]);

  useEffect(() => {
    localStorage.setItem('dayNumber', dayNumber.toString());
  }, [dayNumber]);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleSetCurrentDay = (day: Day) => {
    setCurrentDay(day);
    // When changing themes, set the day number based on current date
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const totalDays = getTotalDaysForTheme(day);
    const adjustedDay = ((dayOfMonth - 1) % totalDays) + 1;
    setDayNumber(adjustedDay);
  };

  const handleSetDayNumber = (day: number) => {
    const totalDays = getTotalDaysForTheme(currentDay);
    // Ensure the day number is within valid bounds
    if (day > 0 && day <= totalDays) {
      setDayNumber(day);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      currentDay, 
      isDarkMode, 
      dayNumber,
      toggleDarkMode, 
      setCurrentDay: handleSetCurrentDay,
      setDayNumber: handleSetDayNumber
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};