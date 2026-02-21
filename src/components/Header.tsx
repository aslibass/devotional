import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { THEMES } from '../constants/themes';
import { Sun, Moon, Home, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

// Extend Window interface for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (element: HTMLElement, config: object) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface HeaderProps {
  onReturnHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReturnHome }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, isLoading, signIn, signOut } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Load Google Identity Services and render sign-in button
  useEffect(() => {
    if (user || isLoading || !googleClientId) return;

    const scriptId = 'google-gis-script';
    if (document.getElementById(scriptId)) {
      initGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogleButton;
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup — reuse across renders
    };
  }, [user, isLoading, googleClientId]);

  function initGoogleButton() {
    const container = document.getElementById('google-signin-btn');
    if (!window.google || !container || !googleClientId) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response: { credential: string }) => {
        try {
          await signIn(response.credential);
        } catch (err) {
          console.error('Sign-in error:', err);
        }
      },
    });

    window.google.accounts.id.renderButton(container, {
      theme: isDarkMode ? 'filled_black' : 'outline',
      size: 'medium',
      shape: 'pill',
      text: 'signin_with',
    });
  }

  const handleSignOut = async () => {
    window.google?.accounts?.id?.disableAutoSelect();
    await signOut();
  };

  return (
    <motion.header
      className="fixed w-full z-20 glass-strong shadow-glass-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title Section */}
          <div className="flex items-center gap-4">
            {onReturnHome && (
              <motion.button
                onClick={onReturnHome}
                className="p-2 rounded-full glass-subtle shadow-glass transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Return to home"
              >
                <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </motion.button>
            )}

            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.01 }}>
              <h1 className="font-serif text-lg md:text-xl tracking-wide">
                <span className="font-light" style={{ color: THEMES.presence.color }}>Presence</span>
                <span className={`mx-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>|</span>
                <span className="font-light" style={{ color: THEMES.healing.color }}>Healing</span>
                <span className={`mx-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>|</span>
                <span className="font-light" style={{ color: THEMES.truth.color }}>Truth</span>
              </h1>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full glass-subtle shadow-glass transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </motion.button>

            {/* Auth Section */}
            {!isLoading && (
              user ? (
                /* Signed-in avatar + sign-out */
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img
                    src={user.picture}
                    alt={user.name}
                    title={`${user.name} (${user.email})`}
                    className="w-8 h-8 rounded-full ring-2 ring-purple-400"
                    referrerPolicy="no-referrer"
                  />
                  <motion.button
                    onClick={handleSignOut}
                    className="p-2 rounded-full glass-subtle shadow-glass transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                </motion.div>
              ) : (
                /* Google Sign-In button rendered by GIS */
                googleClientId ? (
                  <div id="google-signin-btn" aria-label="Sign in with Google" />
                ) : null
              )
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;