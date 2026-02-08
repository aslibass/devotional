import React, { createContext, useContext, useState } from 'react';
import { Devotional, Day } from '../types';
import { getDevotionalForDay, getTotalDaysForTheme } from '../utils/devotionalService';

interface DevotionalContextType {
  devotional: Devotional | null;
  isLoading: boolean;
  error: string | null;
  generateDevotional: (day: Day, dayNumber: number) => Promise<void>;
  totalDays: number;
}

const DevotionalContext = createContext<DevotionalContextType | undefined>(undefined);

export const DevotionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalDays, setTotalDays] = useState<number>(0);

  const generateDevotional = async (day: Day, dayNumber: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedDevotional = getDevotionalForDay(day, dayNumber);
      const totalDaysForTheme = getTotalDaysForTheme(day);
      
      setTotalDays(totalDaysForTheme);
      
      if (!loadedDevotional) {
        throw new Error('No devotional found for this day');
      }
      
      setDevotional(loadedDevotional);
    } catch (err) {
      setError('Failed to load devotional. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DevotionalContext.Provider value={{ 
      devotional, 
      isLoading, 
      error, 
      generateDevotional,
      totalDays
    }}>
      {children}
    </DevotionalContext.Provider>
  );
};

export const useDevotional = () => {
  const context = useContext(DevotionalContext);
  if (context === undefined) {
    throw new Error('useDevotional must be used within a DevotionalProvider');
  }
  return context;
};