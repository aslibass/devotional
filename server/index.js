import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3001;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// In-memory usage log: email → { count, name, lastUsed }
const usageLog = new Map();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://accounts.google.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:', 'https://lh3.googleusercontent.com'],
            connectSrc: ["'self'"],
            frameSrc: ['https://accounts.google.com'],
        },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ── Auth middleware ───────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
    const token = req.cookies?.authToken;
    if (!token) {
        return res.status(401).json({ error: 'Sign in with Google to use this feature.' });
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.clearCookie('authToken');
        return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    }
}

// ── Helper: set auth cookie ───────────────────────────────────────────────────
function setAuthCookie(res, user) {
    const token = jwt.sign(
        { email: user.email, name: user.name, picture: user.picture },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return token;
}

// ── Auth routes ───────────────────────────────────────────────────────────────

// Exchange Google ID token → JWT session cookie
app.post('/api/auth/google', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ error: 'Missing credential' });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const user = {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        };

        setAuthCookie(res, user);
        res.json({ user });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ error: 'Invalid Google credential.' });
    }
});

// Return current user from JWT cookie (for session restore on page refresh)
app.get('/api/auth/me', (req, res) => {
    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
        const user = jwt.verify(token, JWT_SECRET);
        res.json({ user: { email: user.email, name: user.name, picture: user.picture } });
    } catch {
        res.clearCookie('authToken');
        res.status(401).json({ error: 'Session expired' });
    }
});

// Sign out — clear cookie
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('authToken');
    res.json({ ok: true });
});

// ── Usage tracking ────────────────────────────────────────────────────────────

// View credit usage (basic admin endpoint — no auth needed for now, just for visibility)
app.get('/api/usage', (req, res) => {
    const entries = [...usageLog.entries()].map(([email, data]) => ({
        email,
        ...data,
    }));
    entries.sort((a, b) => b.count - a.count);
    res.json({ total: entries.reduce((sum, e) => sum + e.count, 0), users: entries });
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Gemini reflection (AUTH REQUIRED) ────────────────────────────────────────
app.post('/api/reflection', requireAuth, async (req, res) => {
    try {
        const { reflection, theme, scripture } = req.body;

        if (!reflection || !theme || !scripture) {
            return res.status(400).json({ error: 'Missing required fields: reflection, theme, scripture' });
        }

        // Track usage per user
        const { email, name } = req.user;
        const existing = usageLog.get(email) || { count: 0, name };
        usageLog.set(email, { name, count: existing.count + 1, lastUsed: new Date().toISOString() });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are a deeply spiritual, contemplative guide who responds to personal reflections with wisdom, gentleness, and profound insight. The user has shared a reflection based on the theme of **${theme}** and Scripture: "${scripture}". Here is their reflection: ${reflection}.

Your task is to provide three responses that form a cohesive spiritual response:

1. **Spiritual Insight** (40-60 words):
   - Draw a connection between their reflection and the scripture
   - Include wisdom from one of these trusted voices on ${theme}:
     ${theme === 'truth' ? `
     - C.S. Lewis, John Lennox, Alister McGrath, Nancy Pearcey,
     - Rebecca McLaughlin, Sean McDowell, Kevin DeYoung,
     - William Lane Craig, Os Guinness, Al Mohler`
                : theme === 'healing' ? `
     - Thom Gardner, Leanne Payne, Dan Allender,
     - Sheila Walsh, John Eldredge, Beth Moore, Sue Detweiler`
                    : `
     - Brother Lawrence, Dallas Willard, A.W. Tozer,
     - Mike Yaconelli, Sarah Clarkson, Eugene Peterson, Roy Godwin`}
   - Offer a fresh perspective that deepens their understanding

2. **Celtic-Style Blessing** (4-6 lines):
   - Write a poetic blessing that speaks to their specific reflection
   - Use nature imagery and Celtic Christian rhythms
   - Make it personal and specific to their journey
   - Focus on ${theme === 'presence' ? "awareness of God's presence"
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

        const cleanedContent = text
            .replace(/^```json\n/, '')
            .replace(/\n```$/, '')
            .trim();

        const parsedResponse = JSON.parse(cleanedContent);

        res.json({
            insight: parsedResponse.insight || 'Thank you for sharing your reflection.',
            blessing: parsedResponse.blessing || 'May God continue to guide your journey.',
            prayer: parsedResponse.prayer || 'Lord, bless this moment of reflection.',
        });

    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({
            insight: 'Thank you for sharing your reflection.',
            blessing: 'May God continue to guide your journey.',
            prayer: 'Lord, bless this moment of reflection.',
        });
    }
});

// ── Serve static frontend ─────────────────────────────────────────────────────
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../dist')));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Backend API running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🎨 Frontend served from: ${path.join(__dirname, '../dist')}`);
    if (!process.env.GOOGLE_CLIENT_ID) {
        console.warn('⚠️  GOOGLE_CLIENT_ID not set — Google auth will not work');
    }
    if (JWT_SECRET === 'dev-secret-change-in-production') {
        console.warn('⚠️  Using default JWT_SECRET — set a strong secret in production');
    }
});
