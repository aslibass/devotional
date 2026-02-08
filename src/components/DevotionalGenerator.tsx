import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevotional } from '../contexts/DevotionalContext';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants/themes';
import DevotionalCard from './DevotionalCard';
import LoadingSpinner from './LoadingSpinner';
import { Sparkles, Heart, Lightbulb, ChevronDown, ChevronUp, Timer, Users, BookOpen, ArrowRight, Info, Play } from 'lucide-react';
import authorsData from '../data/authors.json';

interface DevotionalGeneratorProps {
  onShowAbout?: () => void;
}

const DevotionalGenerator: React.FC<DevotionalGeneratorProps> = ({ onShowAbout }) => {
  const { devotional, isLoading, error, generateDevotional, totalDays } = useDevotional();
  const { currentDay, isDarkMode, dayNumber, setDayNumber, setCurrentDay } = useTheme();
  const theme = THEMES[currentDay];
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Scroll to top when devotional loads or changes
  useEffect(() => {
    if (devotional && !isLoading) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [devotional, isLoading]);

  const handleStart = (selectedTheme: 'presence' | 'healing' | 'truth') => {
    setCurrentDay(selectedTheme);
    generateDevotional(selectedTheme, dayNumber);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    let newDay = direction === 'next' ? dayNumber + 1 : dayNumber - 1;
    if (newDay > totalDays) newDay = 1;
    if (newDay < 1) newDay = totalDays;
    setDayNumber(newDay);
    generateDevotional(currentDay, newDay);
  };

  const themeIcons = {
    presence: <Sparkles className="text-white" size={24} aria-hidden="true" />,
    healing: <Heart className="text-white" size={24} aria-hidden="true" />,
    truth: <Lightbulb className="text-white" size={24} aria-hidden="true" />
  };

  // Get authors data for each theme
  const getThemeContent = (themeKey: 'presence' | 'healing' | 'truth') => {
    const themeName = themeKey.charAt(0).toUpperCase() + themeKey.slice(1);
    const themeData = authorsData.themes.find(t => t.theme === themeName);
    const authors = themeData ? themeData.authors.slice(0, 6) : []; // Show first 6 authors
    const totalAuthors = themeData ? themeData.authors.length : 0;

    const descriptions = {
      presence: "Experience God's constant nearness in your daily life",
      healing: "Journey toward wholeness and restoration",
      truth: "Discover and embrace transformative spiritual truth"
    };

    const features = {
      presence: ["10-15 minute practice", "Guided meditation", "Personal reflection"],
      healing: ["Gentle guided process", "Safe space for processing", "Healing prayer"],
      truth: ["Deep scriptural insights", "Thoughtful contemplation", "Personal application"]
    };

    return {
      title: `${themeName}`,
      description: descriptions[themeKey],
      features: features[themeKey],
      authors,
      totalAuthors
    };
  };

  if (!devotional && !isLoading && !error) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Choose Your Journey</h2>
          <p className="text-lg opacity-75 mb-6">Select a spiritual path to begin your daily practice</p>
          
          {/* Link to About Section */}
          {onShowAbout && (
            <motion.button
              onClick={onShowAbout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Info size={16} />
              <span>Learn more about our approach</span>
              <ArrowRight size={14} />
            </motion.button>
          )}
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {(['presence', 'healing', 'truth'] as const).map((type, index) => {
            const themeContent = getThemeContent(type);
            
            return (
              <motion.div
                key={type}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${
                  isDarkMode ? 'hover:bg-opacity-30' : 'hover:bg-opacity-90'
                }`}
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'white',
                  boxShadow: `0 4px 20px ${THEMES[type].color}15`
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedCard(expandedCard === type ? null : type)}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: THEMES[type].color }}
                    >
                      {themeIcons[type]}
                    </div>
                    <div className="flex-grow">
                      <h3 
                        className="font-serif text-xl md:text-2xl"
                        style={{ color: THEMES[type].color }}
                      >
                        {themeContent.title}
                      </h3>
                      <p className="text-sm opacity-75">
                        {themeContent.description}
                      </p>
                    </div>
                    <button 
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label={expandedCard === type ? "Show less" : "Show more"}
                    >
                      {expandedCard === type ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Prominent Begin Journey Button - Always Visible When Expanded */}
                <AnimatePresence>
                  {expandedCard === type && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {/* PROMINENT BEGIN JOURNEY BUTTON - MOVED TO TOP */}
                      <div className="px-6 pb-4">
                        <motion.button
                          onClick={() => handleStart(type)}
                          className="w-full py-4 rounded-xl text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium shadow-lg"
                          style={{ 
                            backgroundColor: THEMES[type].color,
                            boxShadow: `0 8px 25px ${THEMES[type].color}40`
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: `0 12px 35px ${THEMES[type].color}50`
                          }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Play size={20} />
                          <span>Begin {themeContent.title} Journey</span>
                        </motion.button>
                      </div>

                      {/* Additional Content Below */}
                      <div className="p-6 pt-0 space-y-6">
                        <div className="grid gap-3">
                          {themeContent.features.map((feature, i) => (
                            <div 
                              key={i}
                              className="flex items-center gap-3 p-3 rounded-lg"
                              style={{ 
                                backgroundColor: isDarkMode ? THEMES[type].darkBg : THEMES[type].lightBg,
                                border: `1px solid ${THEMES[type].accent}`
                              }}
                            >
                              <Timer size={16} style={{ color: THEMES[type].color }} />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 
                              className="font-serif text-lg flex items-center gap-2"
                              style={{ color: THEMES[type].color }}
                            >
                              <Users size={18} />
                              <span>Inspired By</span>
                            </h4>
                            <span className="text-xs opacity-60">
                              Showing 6 of {themeContent.totalAuthors} teachers
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-3 mb-4">
                            {themeContent.authors.map((author, i) => (
                              <motion.div 
                                key={i}
                                className="p-3 rounded-lg"
                                style={{ 
                                  backgroundColor: isDarkMode ? THEMES[type].darkBg : THEMES[type].lightBg,
                                  border: `1px solid ${THEMES[type].accent}`
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                              >
                                <p className="font-medium mb-1 text-sm">{author.name}</p>
                                <p className="text-xs opacity-75 leading-relaxed">{author.about.substring(0, 80)}...</p>
                              </motion.div>
                            ))}
                          </div>

                          {/* View All Teachers Link */}
                          {onShowAbout && (
                            <motion.button
                              onClick={onShowAbout}
                              className="w-full py-2 rounded-lg text-sm transition-all duration-300 flex items-center justify-center gap-2"
                              style={{ 
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                                border: `1px solid ${THEMES[type].color}30`,
                                color: THEMES[type].color
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span>View all {themeContent.totalAuthors} spiritual guides</span>
                              <ArrowRight size={14} />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner color={theme.color} />
        </motion.div>
        <motion.p 
          className="mt-6 text-lg opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Creating your space...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-6">{error}</p>
        <motion.button
          onClick={() => generateDevotional(currentDay, dayNumber)}
          className="px-6 py-3 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  return devotional ? (
    <DevotionalCard 
      devotional={devotional} 
      onNavigate={handleNavigate}
      totalDays={totalDays}
    />
  ) : null;
};

export default DevotionalGenerator;