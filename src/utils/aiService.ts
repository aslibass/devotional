import OpenAI from 'openai';
import { Day } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a deeply spiritual, contemplative guide who responds to personal reflections with wisdom, gentleness, and profound insight. The user has shared a reflection based on the theme of **${theme}** and Scripture: "${scripture}". Here is their reflection ${reflection}.

Your task is to provide three responses that form a cohesive spiritual response:

1. **Spiritual Insight** (40-60 words):
   - Draw a connection between their reflection and the scripture
   - Include wisdom from one of these trusted voices on ${theme}:
     ${theme === 'truth' ? `
     - John Lennox, C.S. Lewis, Amy Orr-Ewing, Tim Keller, 
     - Rebecca McLaughlin, Alister McGrath, Nancy Pearcey, 
     - Os Guinness, N.T. Wright, William Lane Craig` 
     : theme === 'healing' ? `
     - Henri Nouwen, Brennan Manning, John Eldredge,
     - Dan Allender, Sheila Walsh, Jackie Hill Perry,
     - Leanne Payne, Sue Detweiler, Mark Yaconelli`
     : `
     - Brother Lawrence, Dallas Willard, A.W. Tozer,
     - Richard Foster, Thomas Merton, Julian of Norwich,
     - Eugene Peterson, Jean Vanier, Sarah Clarkson`}
   - Offer a fresh perspective that deepens their understanding

2. **Celtic-Style Blessing** (4-6 lines):
   - Write a poetic blessing that speaks to their specific reflection
   - Use nature imagery and Celtic Christian rhythms
   - Make it personal and specific to their journey
   - Focus on ${theme === 'presence' ? 'awareness of God\'s presence'
     : theme === 'healing' ? 'divine restoration'
     : 'embracing truth'}

3. **Contemplative Prayer** :
  Write a personal, Spirit-led prayer **to God** on behalf of the user, based on what they expressed in their journal or drawing.  
- Speak to the heart of their specific experience — their emotion, longing, doubt, fear, or praise.  
- Refer to what they are seeking or struggling with.  
- Invite God into their actual story and situation.  
- Use gentle, biblical language of nearness, comfort, trust, or truth.  
- Keep it short: 3–5 sincere, heartfelt sentences

Format your response as valid JSON with these three fields. Keep each response concise and focused.

Example:
{
  "insight": "Your awareness of God's presence in nature reflects...",
  "blessing": "May your growing sensitivity to God's presence...",
  "prayer": "Father, continue to open my eyes to..."
}`
        },
        {
          role: "user",
          content: reflection
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const cleanedContent = (response.choices[0].message.content || "{}")
      .replace(/^```json\n/, '')
      .replace(/\n```$/, '')
      .trim();

    const parsedResponse = JSON.parse(cleanedContent);
    return {
      insight: parsedResponse.insight || "Thank you for sharing your reflection.",
      blessing: parsedResponse.blessing || "May God continue to guide your journey.",
      prayer: parsedResponse.prayer || "Lord, bless this moment of reflection."
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