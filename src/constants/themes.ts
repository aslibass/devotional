import { DevotionalTheme, Day } from '../types';

export const THEMES: Record<Day, DevotionalTheme> = {
  presence: {
    name: 'Presence',
    description: "God's nearness",
    color: '#3B429F', // Deep Twilight
    accent: '#91A6FF',
    lightBg: '#F0F2FF',
    darkBg: '#0F1133'
  },
  healing: {
    name: 'Healing',
    description: 'Restoration of heart and body',
    color: '#CF7D34', // Golden Amber (The "Hero" color)
    accent: '#F2C18F',
    lightBg: '#FDF1E4',
    darkBg: '#48280F'
  },
  truth: {
    name: 'Truth',
    description: 'Revealing and replacing spiritual lies',
    color: '#9E65A9', // Sunset Purple
    accent: '#D4AEE3',
    lightBg: '#F5E9F7',
    darkBg: '#37224D'
  },
  integrated: {
    name: 'Integrated',
    description: 'Combines all three',
    color: '#D97706', // Richer Amber
    accent: '#FCD34D',
    lightBg: '#FFFBEB',
    darkBg: '#451A03'
  }
};

export const DAY_CYCLE: Day[] = ['presence', 'healing', 'truth'];