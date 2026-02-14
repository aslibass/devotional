import { Day } from '../types';

// Use relative URL in production (Railway), localhost in development
const API_URL = import.meta.env.VITE_API_URL || '';

export const generateReflectionResponse = async (
  reflection: string,
  theme: Day,
  scripture: string
): Promise<{
  insight: string;
  blessing: string;
  prayer: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/api/reflection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reflection,
        theme,
        scripture
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      insight: data.insight || "Thank you for sharing your reflection.",
      blessing: data.blessing || "May God continue to guide your journey.",
      prayer: data.prayer || "Lord, bless this moment of reflection."
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      insight: "Thank you for sharing your reflection.",
      blessing: "May God continue to guide your journey.",
      prayer: "Lord, bless this moment of reflection."
    };
  }
};