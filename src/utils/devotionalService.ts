import devotionalData from '../data/devotionals.json';
import { Devotional, Day } from '../types';

// Local image paths for promises
const localPromiseImages = {
  presence: "/images/promises/presence-sunrise.jpg",
  healing: "/images/promises/healing-stream.jpg",
  truth: "/images/promises/truth-light.jpg"
};

// Fallback images if specific day images aren't available
const fallbackDevotionalImages = {
  presence: "/images/devotionals/presence/presence-default.jpg",
  healing: "/images/devotionals/healing/healing-default.jpg",
  truth: "/images/devotionals/truth/truth-default.jpg"
};

// Example promises and images - you can use these as templates
const examplePromises = {
  presence: {
    promiseForTheDay: "I am never alone; God's presence surrounds me like the morning light",
    promiseImage: localPromiseImages.presence
  },
  healing: {
    promiseForTheDay: "God's healing flows through me like a gentle stream, restoring what was broken",
    promiseImage: localPromiseImages.healing
  },
  truth: {
    promiseForTheDay: "Truth illuminates my path and sets my spirit free from every lie",
    promiseImage: localPromiseImages.truth
  }
};

export const getDevotionalForDay = (day: Day, dayNumber: number): Devotional | null => {
  const devotionals = devotionalData.devotionals.filter(d => d.day === day);
  const baseDevotional = devotionals[dayNumber - 1];

  if (!baseDevotional) return null;

  // Use the localPath from JSON if available, otherwise use fallback
  const devotionalImage = baseDevotional.localPath || fallbackDevotionalImages[day];

  // Add curated local images
  const devotional = {
    ...baseDevotional,
    promiseForTheDay: baseDevotional.promiseForTheDay || examplePromises[day].promiseForTheDay,
    promiseImage: baseDevotional.promiseImage || examplePromises[day].promiseImage,
    devotionalImage: devotionalImage
  };

  return devotional;
};

export const getTotalDaysForTheme = (theme: Day): number => {
  return devotionalData.devotionals.filter(d => d.day === theme).length;
};

// Helper function to get devotional image with fallback
export const getDevotionalImageWithFallback = (day: Day, dayNumber: number): string => {
  const devotionals = devotionalData.devotionals.filter(d => d.day === day);
  const devotional = devotionals[dayNumber - 1];

  // Return the localPath if it exists, otherwise use fallback
  return devotional?.localPath || fallbackDevotionalImages[day];
};

// ============================================
// ROTATION SYSTEM - Cycles through all 93 devotionals
// ============================================

export interface RotationInfo {
  absoluteDay: number;      // 1-93 (current day in rotation)
  theme: Day;               // Current theme (presence, healing, truth)
  themeDay: number;         // Day number within that theme (1-31)
  totalDays: number;        // Total days in rotation (93)
  themeName: string;        // Capitalized theme name
  progress: number;         // Percentage complete (0-100)
}

/**
 * Get devotional by absolute rotation day (1-93)
 * Rotation pattern: P1, H1, T1, P2, H2, T2, P3, H3, T3, ...
 */
export const getDevotionalByRotationDay = (absoluteDay: number): Devotional | null => {
  // Normalize to 1-93 range (cycles after 93)
  const normalizedDay = ((absoluteDay - 1) % 93) + 1;

  // Calculate which theme and day number
  // Pattern: Day 1=P1, Day 2=H1, Day 3=T1, Day 4=P2, Day 5=H2, Day 6=T2...
  const themeIndex = (normalizedDay - 1) % 3; // 0=presence, 1=healing, 2=truth
  const dayNumber = Math.floor((normalizedDay - 1) / 3) + 1;

  const themes: Day[] = ['presence', 'healing', 'truth'];
  const theme = themes[themeIndex];

  return getDevotionalForDay(theme, dayNumber);
};

/**
 * Get rotation information for display
 */
export const getRotationInfo = (absoluteDay: number): RotationInfo => {
  const normalizedDay = ((absoluteDay - 1) % 93) + 1;
  const themeIndex = (normalizedDay - 1) % 3;
  const dayNumber = Math.floor((normalizedDay - 1) / 3) + 1;
  const themes: Day[] = ['presence', 'healing', 'truth'];
  const theme = themes[themeIndex];

  const themeNames = {
    presence: 'Presence',
    healing: 'Healing',
    truth: 'Truth'
  };

  return {
    absoluteDay: normalizedDay,
    theme,
    themeDay: dayNumber,
    totalDays: 93,
    themeName: themeNames[theme],
    progress: Math.round((normalizedDay / 93) * 100)
  };
};

/**
 * Get the current rotation day based on quarterly calendar
 * Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec)
 * Resets at the start of each quarter
 */
export const getCurrentRotationDay = (startDate?: Date): number => {
  const today = new Date();
  const month = today.getMonth(); // 0-11
  const dayOfMonth = today.getDate(); // 1-31

  // Determine quarter start month (0=Jan, 3=Apr, 6=Jul, 9=Oct)
  const quarterStartMonth = Math.floor(month / 3) * 3;

  // Calculate days elapsed in current quarter
  let daysInQuarter = 0;

  // Add days from complete months in this quarter
  for (let m = quarterStartMonth; m < month; m++) {
    const year = today.getFullYear();
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    daysInQuarter += daysInMonth;
  }

  // Add days from current month
  daysInQuarter += dayOfMonth;

  // Cycle through 1-93
  return ((daysInQuarter - 1) % 93) + 1;
};

/**
 * Get total number of devotionals
 */
export const getTotalDevotionals = (): number => {
  return 93;
};