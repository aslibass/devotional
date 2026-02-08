export interface Devotional {
  day: Day;
  invocation: string;
  scripture: {
    reference: string;
    text: string;
  };
  reflection: string;
  physicalAction: string;
  guidedPrayer: string;
  truthToCarry: string;
  benediction: string;
  teaching: string;
  insight: string;
  promiseForTheDay: string;
  promiseImage: string;
  devotionalImage?: string; // Optional curated image for each devotional
}

export type Day = 'presence' | 'healing' | 'truth' | 'integrated';

export interface DevotionalTheme {
  name: string;
  description: string;
  color: string;
  accent: string;
  lightBg: string;
  darkBg: string;
}