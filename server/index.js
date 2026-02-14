import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini with server-side API key (NOT exposed to browser)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// CORS configuration - allow frontend to call this API
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Gemini reflection endpoint - proxies requests to keep API key secure
app.post('/api/reflection', async (req, res) => {
    try {
        const { reflection, theme, scripture } = req.body;

        // Validate request
        if (!reflection || !theme || !scripture) {
            return res.status(400).json({
                error: 'Missing required fields: reflection, theme, scripture'
            });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are a deeply spiritual, contemplative guide who responds to personal reflections with wisdom, gentleness, and profound insight. The user has shared a reflection based on the theme of **${theme}** and Scripture: "${scripture}". Here is their reflection: ${reflection}.

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

3. **Contemplative Prayer**:
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
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the response text
        const cleanedContent = text
            .replace(/^```json\n/, '')
            .replace(/\n```$/, '')
            .trim();

        const parsedResponse = JSON.parse(cleanedContent);

        res.json({
            insight: parsedResponse.insight || "Thank you for sharing your reflection.",
            blessing: parsedResponse.blessing || "May God continue to guide your journey.",
            prayer: parsedResponse.prayer || "Lord, bless this moment of reflection."
        });

    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({
            insight: "Thank you for sharing your reflection.",
            blessing: "May God continue to guide your journey.",
            prayer: "Lord, bless this moment of reflection."
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend API running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
