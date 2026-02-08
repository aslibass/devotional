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