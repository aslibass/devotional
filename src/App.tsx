import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { DevotionalProvider } from './contexts/DevotionalContext';
import Layout from './components/Layout';
import DevotionalGenerator from './components/DevotionalGenerator';
import About from './components/About';
import { Info, ArrowLeft } from 'lucide-react';

function App() {
  const [showAbout, setShowAbout] = useState(false);

  const handleReturnHome = () => {
    setShowAbout(false);
    // Force a page refresh to reset the devotional state
    window.location.reload();
  };

  const handleShowAbout = () => {
    setShowAbout(true);
  };

  return (
    <ThemeProvider>
      <DevotionalProvider>
        <Layout onReturnHome={handleReturnHome}>
          <div className="flex justify-end gap-2 mb-4">
            {showAbout && (
              <button
                onClick={() => setShowAbout(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Devotional
              </button>
            )}
            <button
              onClick={handleShowAbout}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Info size={18} />
              About
            </button>
          </div>
          
          {showAbout ? (
            <About />
          ) : (
            <DevotionalGenerator onShowAbout={handleShowAbout} />
          )}
        </Layout>
      </DevotionalProvider>
    </ThemeProvider>
  );
}

export default App;