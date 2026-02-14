import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { DevotionalProvider } from './contexts/DevotionalContext';
import { useTheme } from './contexts/ThemeContext';
import { useDevotional } from './contexts/DevotionalContext';
import Layout from './components/Layout';
import RotationDevotional from './components/RotationDevotional';
import LandingPage from './components/LandingPage';
import About from './components/About';
import { Info, ArrowLeft } from 'lucide-react';

function AppContent() {
  const [showAbout, setShowAbout] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const { hasSeenLanding, startJourney, rotationDay } = useTheme();
  const { generateRotationDevotional } = useDevotional();
  const hasLoadedDevotional = useRef(false);

  // Check if user should see landing page
  useEffect(() => {
    if (!hasSeenLanding) {
      setShowLanding(true);
    }
  }, [hasSeenLanding]);

  // Auto-load rotation devotional when journey has started (only once)
  useEffect(() => {
    if (hasSeenLanding && !showLanding && !showAbout && !hasLoadedDevotional.current) {
      hasLoadedDevotional.current = true;
      generateRotationDevotional(rotationDay);
    }
  }, [hasSeenLanding, showLanding, showAbout, rotationDay, generateRotationDevotional]);

  const handleReturnHome = () => {
    setShowAbout(false);
    // Reload current rotation day
    generateRotationDevotional(rotationDay);
  };

  const returnToLanding = () => {
    setShowLanding(true);
  };

  const handleBeginJourney = () => {
    startJourney();
    setShowLanding(false);
    // Will trigger the useEffect above to load day 1
  };

  // Show landing page for first-time users
  if (showLanding) {
    return <LandingPage onBeginJourney={handleBeginJourney} />;
  }

  // Show About page
  if (showAbout) {
    return (
      <Layout>
        <button
          onClick={handleReturnHome}
          className="fixed top-20 left-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </button>
        <About />
      </Layout>
    );
  }

  // Main app view
  return (
    <Layout onReturnHome={returnToLanding}>
      <RotationDevotional />

      {/* About Button */}
      <button
        onClick={() => setShowAbout(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
        aria-label="About"
      >
        <Info size={24} />
      </button>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DevotionalProvider>
        <AppContent />
      </DevotionalProvider>
    </ThemeProvider>
  );
}

export default App;