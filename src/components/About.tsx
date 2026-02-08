import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants/themes';
import { Heart, Lightbulb, Compass, BookOpen, ChevronDown, ChevronUp, Users, Quote, Book } from 'lucide-react';
import authorsData from '../data/authors.json';

const About: React.FC = () => {
  const { currentDay, isDarkMode } = useTheme();
  const theme = THEMES[currentDay];
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Get authors data organized by theme
  const getAuthorsByTheme = (themeName: string) => {
    const themeData = authorsData.themes.find(t => t.theme === themeName);
    return themeData ? themeData.authors : [];
  };

  // Calculate total number of authors
  const totalAuthors = authorsData.themes.reduce((total, theme) => total + theme.authors.length, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.h2 
        className="font-serif text-3xl md:text-4xl mb-8 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ color: theme.color }}
      >
        About This Journey
      </motion.h2>

      <motion.div 
        className="grid md:grid-cols-3 gap-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-opacity-20 bg-black' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: THEMES.presence.color }}
            >
              <Compass className="text-white" size={20} />
            </div>
            <h3 className="font-serif text-xl ml-3" style={{ color: THEMES.presence.color }}>Presence</h3>
          </div>
          <p className="text-sm leading-relaxed">
            Discover the profound reality of God's constant presence in your daily life. Through guided meditation and reflection, learn to recognize and rest in His nearness in every moment.
          </p>
        </div>

        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-opacity-20 bg-black' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: THEMES.healing.color }}
            >
              <Heart className="text-white" size={20} />
            </div>
            <h3 className="font-serif text-xl ml-3" style={{ color: THEMES.healing.color }}>Healing</h3>
          </div>
          <p className="text-sm leading-relaxed">
            Experience restoration for body, mind, and spirit through intentional meditation on God's healing power. Journey through prayers and reflections designed to bring wholeness to wounded places.
          </p>
        </div>

        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-opacity-20 bg-black' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: THEMES.truth.color }}
            >
              <Lightbulb className="text-white" size={20} />
            </div>
            <h3 className="font-serif text-xl ml-3" style={{ color: THEMES.truth.color }}>Truth</h3>
          </div>
          <p className="text-sm leading-relaxed">
            Uncover and embrace transformative spiritual truths that set you free from limiting beliefs. Through scripture and guided reflection, align your heart with God's perspective.
          </p>
        </div>
      </motion.div>

      {/* Inspirational Figures Section */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users size={24} style={{ color: theme.color }} />
            <h3 className="font-serif text-2xl" style={{ color: theme.color }}>Our Spiritual Guides</h3>
          </div>
          <p className="text-sm opacity-75 max-w-2xl mx-auto">
            This devotional draws wisdom from {totalAuthors} trusted spiritual teachers, theologians, and practitioners who have shaped Christian contemplative practice across centuries.
          </p>
        </div>

        <div className="space-y-4">
          {(['Presence', 'Healing', 'Truth'] as const).map((themeName) => {
            const themeKey = themeName.toLowerCase() as 'presence' | 'healing' | 'truth';
            const authors = getAuthorsByTheme(themeName);
            
            return (
              <motion.div
                key={themeName}
                className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-opacity-20 bg-black' : 'bg-white'} shadow-lg`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <button
                  onClick={() => toggleSection(themeName)}
                  className="w-full p-6 text-left transition-all duration-300 hover:bg-opacity-50"
                  style={{ 
                    backgroundColor: expandedSection === themeName 
                      ? `${THEMES[themeKey].color}10` 
                      : 'transparent' 
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: THEMES[themeKey].color }}
                      >
                        {themeKey === 'presence' && <Compass className="text-white" size={16} />}
                        {themeKey === 'healing' && <Heart className="text-white" size={16} />}
                        {themeKey === 'truth' && <Lightbulb className="text-white" size={16} />}
                      </div>
                      <div>
                        <h4 
                          className="font-serif text-lg"
                          style={{ color: THEMES[themeKey].color }}
                        >
                          {THEMES[themeKey].name} Teachers
                        </h4>
                        <p className="text-sm opacity-75">
                          {authors.length} spiritual guides
                        </p>
                      </div>
                    </div>
                    <div 
                      className="p-2 rounded-full transition-transform duration-300"
                      style={{ 
                        backgroundColor: `${THEMES[themeKey].color}20`,
                        transform: expandedSection === themeName ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <ChevronDown size={16} style={{ color: THEMES[themeKey].color }} />
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedSection === themeName && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0">
                        <div className="grid gap-4">
                          {authors.map((author, index) => (
                            <motion.div
                              key={author.name}
                              className="p-4 rounded-lg"
                              style={{ 
                                backgroundColor: isDarkMode ? THEMES[themeKey].darkBg : THEMES[themeKey].lightBg,
                                border: `1px solid ${THEMES[themeKey].accent}`
                              }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                              <div className="flex items-start gap-3">
                                <Quote size={14} style={{ color: THEMES[themeKey].color }} className="mt-1 flex-shrink-0" />
                                <div className="flex-grow">
                                  <h5 
                                    className="font-medium mb-2"
                                    style={{ color: THEMES[themeKey].color }}
                                  >
                                    {author.name}
                                  </h5>
                                  <p className="text-xs opacity-75 leading-relaxed mb-3">
                                    {author.about}
                                  </p>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Book size={12} style={{ color: THEMES[themeKey].color }} />
                                    <span className="text-xs font-medium" style={{ color: THEMES[themeKey].color }}>
                                      Notable Works:
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {author.books.map((book, bookIndex) => (
                                      <span
                                        key={bookIndex}
                                        className="text-xs px-2 py-1 rounded-full"
                                        style={{
                                          backgroundColor: `${THEMES[themeKey].color}15`,
                                          color: THEMES[themeKey].color
                                        }}
                                      >
                                        {book}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div 
        className="text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <BookOpen size={24} style={{ color: theme.color }} />
          <h3 className="font-serif text-xl" style={{ color: theme.color }}>Our Approach</h3>
        </div>
        <p className="mb-6 leading-relaxed">
          This devotional app combines ancient spiritual practices with modern technology to create a unique space for encountering God. Each day offers scripture, reflection prompts, and AI-generated insights tailored to your journey.
        </p>
        <p className="text-sm opacity-75">
          Share your thoughts through soul reflection, receive personalized spiritual insights, and watch as AI-generated artwork brings your reflections to life. Your reflections remain private and are not saved, ensuring a personal encounter with God.
        </p>
      </motion.div>
    </div>
  );
};

export default About;