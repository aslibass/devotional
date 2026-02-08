import { DevotionalTheme, Day } from '../types';

export const THEMES: Record<Day, DevotionalTheme> = {
  presence: {
    name: 'Presence',
    description: "God's nearness",
    color: '#2D82B7', // Blue
    accent: '#91C4F2',
    lightBg: '#E1F1FF',
    darkBg: '#0A2E4A'
  },
  healing: {
    name: 'Healing',
    description: 'Restoration of heart and body',
    color: '#3CAD72', // Green
    accent: '#9BDEBD',
    lightBg: '#E6F7EF',
    darkBg: '#0A3B28'
  },
  truth: {
    name: 'Truth',
    description: 'Revealing and replacing spiritual lies',
    color: '#9E65A9', // Purple
    accent: '#D4AEE3',
    lightBg: '#F5E9F7',
    darkBg: '#37224D'
  },
  integrated: {
    name: 'Integrated',
    description: 'Combines all three',
    color: '#CF7D34', // Amber
    accent: '#F2C18F',
    lightBg: '#FDF1E4',
    darkBg: '#48280F'
  }
};

export const DAY_CYCLE: Day[] = ['presence', 'healing', 'truth'];