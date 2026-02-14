import React, { createContext, useContext, useState, useCallback } from 'react';
import { Devotional, Day } from '../types';
import {
  getDevotionalForDay,
  getTotalDaysForTheme,
  getDevotionalByRotationDay,
  getRotationInfo,
  RotationInfo
} from '../utils/devotionalService';

interface DevotionalContextType {
  devotional: Devotional | null;
  isLoading: boolean;
  error: string | null;
  currentRotationDay: number;
  rotationInfo: RotationInfo | null;
  generateDevotional: (day: Day, dayNumber: number) => Promise<void>;
  generateRotationDevotional: (absoluteDay: number) => Promise<void>;
  totalDays: number;
}

const DevotionalContext = createContext<DevotionalContextType | undefined>(undefined);

export const DevotionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [currentRotationDay, setCurrentRotationDay] = useState<number>(1);
  const [rotationInfo, setRotationInfo] = useState<RotationInfo | null>(null);

  const generateDevotional = useCallback(async (day: Day, dayNumber: number) => {
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
      setRotationInfo(null); // Clear rotation info when using theme mode
    } catch (err) {
      setError('Failed to load devotional. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateRotationDevotional = useCallback(async (absoluteDay: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedDevotional = getDevotionalByRotationDay(absoluteDay);
      const info = getRotationInfo(absoluteDay);

      setCurrentRotationDay(absoluteDay);
      setRotationInfo(info);
      setTotalDays(93);

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
  }, []);

  return (
    <DevotionalContext.Provider value={{
      devotional,
      isLoading,
      error,
      generateDevotional,
      generateRotationDevotional,
      currentRotationDay,
      rotationInfo,
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