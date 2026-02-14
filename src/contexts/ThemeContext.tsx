import React, { createContext, useContext, useState, useEffect } from 'react';
import { Day } from '../types';
import { DAY_CYCLE } from '../constants/themes';
import { getTotalDaysForTheme, getCurrentRotationDay } from '../utils/devotionalService';

interface ThemeContextType {
  currentDay: Day;
  isDarkMode: boolean;
  dayNumber: number;
  rotationDay: number;
  hasSeenLanding: boolean;
  toggleDarkMode: () => void;
  setCurrentDay: (day: Day) => void;
  setDayNumber: (day: number) => void;
  setRotationDay: (day: number) => void;
  startJourney: () => void;
  markLandingSeen: () => void;
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

  // Rotation system state - now based on calendar date
  const [rotationDay, setRotationDay] = useState<number>(() => {
    // Always use current calendar date
    return getCurrentRotationDay();
  });

  const [hasSeenLanding, setHasSeenLanding] = useState<boolean>(() => {
    const saved = localStorage.getItem('hasSeenLanding');
    return saved === 'true';
  });

  // Auto-update rotation day based on calendar date
  useEffect(() => {
    const checkAndUpdateRotationDay = () => {
      const newRotationDay = getCurrentRotationDay();
      if (newRotationDay !== rotationDay) {
        setRotationDay(newRotationDay);
      }
    };

    // Check on mount
    checkAndUpdateRotationDay();

    // Check daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      checkAndUpdateRotationDay();
      // Set up daily interval
      const interval = setInterval(checkAndUpdateRotationDay, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [rotationDay]);

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

  useEffect(() => {
    localStorage.setItem('rotationDay', rotationDay.toString());
  }, [rotationDay]);



  useEffect(() => {
    localStorage.setItem('hasSeenLanding', hasSeenLanding.toString());
  }, [hasSeenLanding]);

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

  const handleSetRotationDay = (day: number) => {
    if (day > 0 && day <= 93) {
      setRotationDay(day);
    }
  };

  const startJourney = () => {
    setRotationDay(getCurrentRotationDay());
    setHasSeenLanding(true);
  };

  const markLandingSeen = () => {
    setHasSeenLanding(true);
  };

  return (
    <ThemeContext.Provider value={{
      currentDay,
      isDarkMode,
      dayNumber,
      rotationDay,
      hasSeenLanding,
      toggleDarkMode,
      setCurrentDay: handleSetCurrentDay,
      setDayNumber: handleSetDayNumber,
      setRotationDay: handleSetRotationDay,
      startJourney,
      markLandingSeen
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