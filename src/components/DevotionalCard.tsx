import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants/themes';
import { Devotional } from '../types';
import { Copy, ArrowLeft, ArrowRight, BookOpen, Quote, PenTool, Heart, Timer, Feather, Sparkles, MessageCircle, Star, CheckCircle, Image } from 'lucide-react';
import { generateReflectionResponse } from '../utils/aiService';

interface DevotionalCardProps {
  devotional: Devotional;
  onNavigate: (direction: 'prev' | 'next') => void;
  totalDays: number;
}

const DevotionalCard: React.FC<DevotionalCardProps> = ({ devotional, onNavigate, totalDays }) => {
  const { isDarkMode, dayNumber } = useTheme();
  const theme = THEMES[devotional.day];
  
  // Progress tracking
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  // Content states
  const [journalText, setJournalText] = useState('');
  const [aiResponse, setAiResponse] = useState<{
    insight: string;
    blessing: string;
    prayer: string;
  } | null>(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  // Define the devotional steps
  const steps = [
    { id: 'welcome', title: 'Welcome', icon: Star },
    { id: 'prepare', title: 'Prepare Your Heart', icon: Heart },
    { id: 'scripture', title: 'Scripture', icon: BookOpen },
    { id: 'teaching', title: 'Teaching', icon: Quote },
    { id: 'reflect', title: 'Soul Reflection', icon: PenTool },
    { id: 'pray', title: 'Prayer & Action', icon: Feather },
    { id: 'blessing', title: 'Blessing', icon: Sparkles }
  ];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJournalText(newText);
    if (newText.length > 0) {
      setShowPrompt(false);
    } else {
      setShowPrompt(true);
    }
  };

  const handleGetAIResponse = async () => {
    if (!journalText.trim()) return;
    
    setIsGeneratingResponse(true);
    try {
      const response = await generateReflectionResponse(
        journalText,
        devotional.day,
        devotional.scripture.text
      );

      setAiResponse(response);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const markStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepIndex);
    setCompletedSteps(newCompleted);
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      markStepComplete(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Enhanced image component with better styling
  const DevotionalImage: React.FC<{ className?: string; showCaption?: boolean }> = ({ 
    className = "", 
    showCaption = false 
  }) => {
    if (!devotional.devotionalImage) return null;
    
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <img 
          src={devotional.devotionalImage} 
          alt={`${theme.name} devotional illustration`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {showCaption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white text-sm opacity-90">
              {theme.name} • Day {dayNumber}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl md:text-3xl" style={{ color: theme.color }}>
          {theme.name} • Day {dayNumber}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Previous day"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Next day"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = completedSteps.has(index);
          
          return (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap ${
                isActive ? 'text-white' : ''
              }`}
              style={{
                backgroundColor: isActive 
                  ? theme.color 
                  : isCompleted 
                    ? `${theme.color}20` 
                    : 'transparent',
                border: `1px solid ${theme.color}`,
                color: isActive ? 'white' : theme.color
              }}
            >
              {isCompleted ? (
                <CheckCircle size={16} />
              ) : (
                <Icon size={16} />
              )}
              <span className="hidden md:inline">{step.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            {/* Enhanced Promise Card with Devotional Image Background */}
            <div className="relative overflow-hidden rounded-xl shadow-lg min-h-[400px]">
              {/* Background Image Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: devotional.devotionalImage 
                    ? `url(${devotional.devotionalImage})` 
                    : `url(${devotional.promiseImage})`,
                  filter: 'brightness(0.3)'
                }}
              />
              
              {/* Color Overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.color}90, ${theme.color}60)`
                }}
              />
              
              {/* Content */}
              <div className="relative z-10 p-8 text-white text-center flex flex-col justify-center min-h-[400px]">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Star size={28} className="text-yellow-300" />
                  <h3 className="font-serif text-2xl">Promise for Today</h3>
                  <Star size={28} className="text-yellow-300" />
                </div>
                
                <blockquote className="font-serif text-3xl md:text-4xl leading-relaxed mb-6 text-shadow">
                  "{devotional.promiseForTheDay}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => copyToClipboard(devotional.promiseForTheDay, 'promise')}
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors relative group"
                  >
                    <Copy size={18} />
                    <span 
                      className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    >
                      {copiedText === 'promise' ? 'Copied!' : 'Copy promise'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg mb-6 opacity-75">
                Welcome to your spiritual journey for today. Take a moment to receive this promise into your heart.
              </p>
              <button
                onClick={nextStep}
                className="px-8 py-3 rounded-full text-white transition-all duration-300 flex items-center gap-2 mx-auto"
                style={{ backgroundColor: theme.color }}
              >
                <span>Begin Journey</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        );

      case 'prepare':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Image Header */}
            <DevotionalImage className="h-48 shadow-lg" showCaption />
            
            <div 
              className="p-8 rounded-lg text-center"
              style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'white' }}
            >
              <Heart size={32} style={{ color: theme.color }} className="mx-auto mb-4" />
              <h3 className="font-serif text-2xl mb-4" style={{ color: theme.color }}>
                Prepare Your Heart
              </h3>
              <p className="text-lg italic leading-relaxed mb-6">
                {devotional.invocation}
              </p>
              <div className="text-sm opacity-75 mb-6">
                <p>Take three deep breaths. With each breath, invite God's presence to fill this moment.</p>
              </div>
              <button
                onClick={nextStep}
                className="px-6 py-3 rounded-full text-white transition-all duration-300"
                style={{ backgroundColor: theme.color }}
              >
                I'm Ready
              </button>
            </div>
          </motion.div>
        );

      case 'scripture':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Side-by-side layout for larger screens */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image */}
              <DevotionalImage className="h-64 md:h-80 shadow-lg" />
              
              {/* Scripture Content */}
              <div 
                className="p-6 rounded-lg flex flex-col justify-center"
                style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'white' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen size={24} style={{ color: theme.color }} />
                  <h3 className="font-serif text-xl" style={{ color: theme.color }}>
                    Today's Scripture
                  </h3>
                  <button 
                    onClick={() => copyToClipboard(`${devotional.scripture.text} - ${devotional.scripture.reference}`, 'scripture')}
                    className="ml-auto p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group"
                  >
                    <Copy size={16} />
                    <span 
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    >
                      {copiedText === 'scripture' ? 'Copied!' : 'Copy scripture'}
                    </span>
                  </button>
                </div>

                <div 
                  className="p-4 rounded-md mb-4"
                  style={{ 
                    backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
                    border: `1px solid ${theme.accent}`
                  }}
                >
                  <p className="font-serif text-lg mb-3 italic leading-relaxed">
                    {devotional.scripture.text}
                  </p>
                  <p className="text-sm opacity-75">
                    {devotional.scripture.reference}
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="p-6 rounded-md text-center"
              style={{ 
                backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
                border: `1px solid ${theme.accent}`
              }}
            >
              <h4 className="font-serif text-lg mb-3" style={{ color: theme.color }}>
                Truth to Carry
              </h4>
              <p className="font-serif text-xl italic">
                "{devotional.truthToCarry}"
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm opacity-75 mb-4">
                Read this passage slowly. Let the words settle in your heart.
              </p>
              <button
                onClick={nextStep}
                className="px-6 py-3 rounded-full text-white transition-all duration-300"
                style={{ backgroundColor: theme.color }}
              >
                Continue
              </button>
            </div>
          </motion.div>
        );

      case 'teaching':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'white' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Quote size={24} style={{ color: theme.color }} />
                <h3 className="font-serif text-xl" style={{ color: theme.color }}>
                  Teaching & Insight
                </h3>
              </div>

              {/* Featured Image */}
              <DevotionalImage className="h-56 mb-6 shadow-lg" />

              <div className="space-y-6">
                <div 
                  className="p-6 rounded-md"
                  style={{ 
                    backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
                    border: `1px solid ${theme.accent}`
                  }}
                >
                  <h4 className="font-serif text-lg mb-3" style={{ color: theme.color }}>
                    Teaching
                  </h4>
                  <p className="leading-relaxed">{devotional.teaching}</p>
                </div>

                <div 
                  className="p-6 rounded-md"
                  style={{ 
                    backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
                    border: `1px solid ${theme.accent}`
                  }}
                >
                  <h4 className="font-serif text-lg mb-3" style={{ color: theme.color }}>
                    Historical Insight
                  </h4>
                  <p className="italic leading-relaxed">{devotional.insight}</p>
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={nextStep}
                  className="px-6 py-3 rounded-full text-white transition-all duration-300"
                  style={{ backgroundColor: theme.color }}
                >
                  Ready to Reflect
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'reflect':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'white' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <PenTool size={24} style={{ color: theme.color }} />
                <h3 className="font-serif text-xl" style={{ color: theme.color }}>
                  Soul Reflection
                </h3>
              </div>

              {/* Smaller image for reflection context */}
              <DevotionalImage className="h-32 mb-6 shadow-md" />

              <div 
                className="p-4 rounded-md mb-6"
                style={{ 
                  backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
                  border: `1px solid ${theme.accent}`
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Quote size={18} style={{ color: theme.color }} />
                    <h4 className="font-serif text-lg" style={{ color: theme.color }}>
                      Today's Prompt
                    </h4>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(devotional.reflection, 'reflection')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group"
                    aria-label="Copy reflection prompt"
                  >
                    <Copy size={16} />
                    <span 
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    >
                      {copiedText === 'reflection' ? 'Copied!' : 'Copy prompt'}
                    </span>
                  </button>
                </div>
                <p className="mt-3 italic">{devotional.reflection}</p>
              </div>

              <div className="relative mb-4">
                <textarea
                  value={journalText}
                  onChange={handleJournalChange}
                  onFocus={() => setIsTextareaFocused(true)}
                  onBlur={() => setIsTextareaFocused(false)}
                  placeholder=" "
                  className="w-full min-h-[200px] p-4 rounded-md bg-gray-50 dark:bg-gray-800 border transition-all duration-300 focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    borderColor: isTextareaFocused ? theme.color : theme.accent,
                    boxShadow: isTextareaFocused ? `0 0 0 2px ${theme.color}20` : `0 4px 12px ${theme.color}10`,
                    resize: 'vertical'
                  }}
                />
                {showPrompt && (
                  <div className="absolute top-4 left-4 right-4 pointer-events-none opacity-60">
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>What emotions or thoughts arise as you consider this?</li>
                      <li>How does this connect with your current life situation?</li>
                      <li>What might God be inviting you to see or understand?</li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={nextStep}
                  className="px-6 py-3 rounded-full text-white transition-all duration-300"
                  style={{ backgroundColor: theme.color }}
                >
                  Continue to Prayer
                </button>
                
                <motion.button
                  onClick={handleGetAIResponse}
                  disabled={!journalText.trim() || isGeneratingResponse}
                  className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: journalText.trim() ? theme.color : 'gray',
                    color: 'white',
                    opacity: journalText.trim() ? 1 : 0.5,
                    cursor: journalText.trim() ? 'pointer' : 'not-allowed'
                  }}
                  whileHover={journalText.trim() ? { scale: 1.02 } : {}}
                  whileTap={journalText.trim() ? { scale: 0.98 } : {}}
                >
                  {isGeneratingResponse ? (
                    <>
                      <Sparkles size={18} className="animate-pulse" />
                      <span>Reflecting...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle size={18} />
                      <span>Receive Insight</span>
                    </>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {aiResponse && (
                  <motion.div 
                    className="space-y-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div 
                      className="p-4 rounded-md"
                      style={{ 
                        backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
                        border: `1px solid ${theme.accent}`
                      }}
                    >
                      <h4 className="font-serif text-lg mb-3 flex items-center gap-2" style={{ color: theme.color }}>
                        <Sparkles size={18} />
                        <span>Spiritual Insight</span>
                      </h4>
                      <p className="italic leading-relaxed">{aiResponse.insight}</p>
                    </div>

                    <div 
                      className="p-4 rounded-md"
                      style={{ 
                        backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
                        border: `1px solid ${theme.accent}`
                      }}
                    >
                      <h4 className="font-serif text-lg mb-3" style={{ color: theme.color }}>
                        A Blessing for You
                      </h4>
                      <p className="italic leading-relaxed">{aiResponse.blessing}</p>
                    </div>

                    <div 
                      className="p-4 rounded-md"
                      style={{ 
                        backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
                        border: `1px solid ${theme.accent}`
                      }}
                    >
                      <h4 className="font-serif text-lg mb-3" style={{ color: theme.color }}>
                        A Prayer for Your Journey
                      </h4>
                      <p className="italic leading-relaxed">{aiResponse.prayer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 'pray':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'white' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Heart size={24} style={{ color: theme.color }} />
                <h3 className="font-serif text-xl" style={{ color: theme.color }}>
                  Prayer & Action
                </h3>
              </div>

              {/* Image for prayer context */}
              <DevotionalImage className="h-40 mb-6 shadow-md" />

              <div className="space-y-6">
                <div 
                  className="p-6 rounded-md"
                  style={{ 
                    backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
                    border: `1px solid ${theme.accent}`
                  }}
                >
                  <h4 className="font-serif text-lg mb-3 flex items-center gap-2" style={{ color: theme.color }}>
                    <Timer size={18} />
                    Physical Action
                  </h4>
                  <p className="leading-relaxed">{devotional.physicalAction}</p>
                </div>

                <div 
                  className="p-6 rounded-md"
                  style={{ 
                    backgroundColor: isDarkMode ? theme.darkBg : theme.lightBg,
                    border: `1px solid ${theme.accent}`
                  }}
                >
                  <h4 className="font-serif text-lg mb-3 flex items-center gap-2" style={{ color: theme.color }}>
                    <Feather size={18} />
                    Guided Prayer
                  </h4>
                  <p className="italic leading-relaxed">{devotional.guidedPrayer}</p>
                </div>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm opacity-75 mb-4">
                  Take time to engage with both the physical action and prayer.
                </p>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 rounded-full text-white transition-all duration-300"
                  style={{ backgroundColor: theme.color }}
                >
                  Receive Blessing
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'blessing':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Final image with blessing overlay */}
            <div className="relative overflow-hidden rounded-xl shadow-lg min-h-[300px]">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: devotional.devotionalImage 
                    ? `url(${devotional.devotionalImage})` 
                    : `url(${devotional.promiseImage})`,
                  filter: 'brightness(0.4)'
                }}
              />
              
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.color}70, ${theme.color}50)`
                }}
              />
              
              <div className="relative z-10 p-8 text-white text-center flex flex-col justify-center min-h-[300px]">
                <Sparkles size={32} className="mx-auto mb-4 text-yellow-300" />
                <h3 className="font-serif text-2xl mb-6">
                  Closing Blessing
                </h3>
                <p className="text-lg italic leading-relaxed mb-6">
                  {devotional.benediction}
                </p>
              </div>
            </div>
            
            <div 
              className="p-8 rounded-lg text-center"
              style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'white' }}
            >
              <div className="space-y-4">
                <p className="text-sm opacity-75">
                  Your devotional journey for today is complete. Carry this blessing with you.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="px-6 py-3 rounded-full border transition-all duration-300"
                    style={{ 
                      borderColor: theme.color,
                      color: theme.color
                    }}
                  >
                    Start Over
                  </button>
                  <button
                    onClick={() => onNavigate('next')}
                    className="px-6 py-3 rounded-full text-white transition-all duration-300"
                    style={{ backgroundColor: theme.color }}
                  >
                    Next Day
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderProgressBar()}
      
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            currentStep === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>

        <div className="text-sm opacity-75">
          Step {currentStep + 1} of {steps.length}
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            currentStep === steps.length - 1 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <span>Next</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default DevotionalCard;