# Presence | Healing | Truth

A beautiful devotional web application offering daily spiritual guidance through three themed tracks: Presence, Healing, and Truth.

![Devotional App](https://img.shields.io/badge/React-18.3.1-blue) ![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC)

## ✨ Features

- **Three Devotional Themes**: Presence, Healing, and Truth - each with unique daily content
- **Daily Promise Cards**: Featured promises with curated imagery
- **Dark Mode**: Seamless light/dark theme switching
- **Offline-Ready**: Local image management for offline functionality
- **AI-Powered**: OpenAI integration for dynamic content generation
- **Responsive Design**: Beautiful experience on all devices
- **Smooth Animations**: Framer Motion for delightful interactions

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: OpenAI API

## 📋 Prerequisites

- Node.js 16+ and npm
- OpenAI API key (for AI-powered features)

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aslibass/devotional.git
cd devotional
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

> **⚠️ Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
```

## 🖼️ Image Management

The app uses a curated local image system for optimal performance and offline functionality.

### Image Structure

```
public/images/
├── promises/              # Featured promise images
│   ├── presence-sunrise.jpg
│   ├── healing-stream.jpg
│   └── truth-light.jpg
└── devotionals/           # Daily devotional images
    ├── presence/
    │   ├── presence-default.jpg
    │   ├── presence-day-1.jpg
    │   └── ...
    ├── healing/
    │   ├── healing-default.jpg
    │   ├── healing-day-1.jpg
    │   └── ...
    └── truth/
        ├── truth-default.jpg
        ├── truth-day-1.jpg
        └── ...
```

### Adding Images

#### Promise Images (Welcome Cards)

1. **Presence Theme**: `public/images/promises/presence-sunrise.jpg`
   - Mood: Peaceful, contemplative, ethereal
   - Suggested: Sunrise through trees, misty landscapes

2. **Healing Theme**: `public/images/promises/healing-stream.jpg`
   - Mood: Restorative, gentle, nurturing
   - Suggested: Flowing water, gardens, gentle light

3. **Truth Theme**: `public/images/promises/truth-light.jpg`
   - Mood: Illuminating, revealing, inspiring
   - Suggested: Light breaking through clouds, dawn

#### Devotional Images

**Naming Convention**: `{theme}-day-{number}.jpg`

Examples:
- `presence-day-1.jpg`
- `healing-day-5.jpg`
- `truth-day-12.jpg`

**Fallback Images**: `{theme}-default.jpg`
- Used when specific day image is not found

**Image Guidelines**:
- **Size**: 1920x1080 or larger (16:9 aspect ratio)
- **Format**: JPG, PNG, or WebP
- **Quality**: High resolution for crisp display
- **Content**: No text or watermarks, high contrast areas for text overlay

### Image Loading Behavior

1. System looks for specific day image first
2. Falls back to default theme image if not found
3. Gracefully hides image section if no images available
4. No broken image icons shown to users

## 🚢 Deployment to Railway

### Prerequisites

- GitHub account with access to `aslibass/devotional` repository
- Railway account

### Deployment Steps

1. **Push Code to GitHub**

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. **Connect Railway to GitHub**
   - Log in to [Railway](https://railway.app)
   - Create new project
   - Select "Deploy from GitHub repo"
   - Choose `aslibass/devotional`

3. **Configure Environment Variables**

In Railway dashboard, add:
- `VITE_OPENAI_API_KEY`: Your OpenAI API key

4. **Deploy**

Railway will automatically:
- Detect the Vite configuration
- Run `npm install`
- Run `npm run build`
- Start the preview server

5. **Access Your App**

Railway will provide a public URL for your deployed application.

### Railway Configuration

The project includes `railway.json` for optimal deployment:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 📁 Project Structure

```
devotional/
├── public/
│   ├── favicon.svg
│   └── images/              # Curated devotional images
├── src/
│   ├── components/          # React components
│   ├── contexts/            # React contexts (Theme, Devotional)
│   ├── data/                # Devotional content data
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (not committed)
├── .gitignore
├── package.json
├── railway.json             # Railway deployment config
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Devotional Content

See `example-devotional-data.json` for the data structure used for devotional content.

Each devotional includes:
- Theme (presence, healing, truth)
- Day number
- Title
- Scripture reference
- Content sections
- Reflection prompts
- Prayer

## 🔒 Security

- **API Keys**: Never commit `.env` file
- **Environment Variables**: Use Railway dashboard for production secrets
- **Dependencies**: Regularly update dependencies for security patches

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines if applicable]

## 💬 Support

[Add support contact information]

---

Built with ❤️ for daily spiritual growth
