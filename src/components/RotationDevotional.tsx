import React from 'react';
import { motion } from 'framer-motion';
import { useDevotional } from '../contexts/DevotionalContext';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import DevotionalCard from './DevotionalCard';
import LoadingSpinner from './LoadingSpinner';

const RotationDevotional: React.FC = () => {
    const { devotional, isLoading, error, rotationInfo, generateRotationDevotional } = useDevotional();
    const { isDarkMode, rotationDay, setRotationDay } = useTheme();

    const handleNavigate = (direction: 'prev' | 'next') => {
        const newDay = direction === 'next' ? rotationDay + 1 : rotationDay - 1;
        const normalizedDay = newDay < 1 ? 93 : newDay > 93 ? 1 : newDay;
        setRotationDay(normalizedDay);
        generateRotationDevotional(normalizedDay);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (!devotional || !rotationInfo) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Simple Day Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass shadow-glass">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div className="text-sm">
                        <span className="font-semibold">Day {rotationInfo.absoluteDay}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-600 dark:text-gray-400">
                            {rotationInfo.themeName}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Devotional Content */}
            <DevotionalCard
                devotional={devotional}
                onNavigate={handleNavigate}
                totalDays={93}
            />

            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-between items-center mt-8 gap-4"
            >
                <button
                    onClick={() => handleNavigate('prev')}
                    className="flex items-center gap-2 px-6 py-3 rounded-full glass shadow-glass hover:shadow-glass-lg transition-all duration-300"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {rotationDay === 93 ? 'Journey Complete! 🎉' : `${93 - rotationDay} days remaining`}
                    </p>
                </div>

                <button
                    onClick={() => handleNavigate('next')}
                    className="flex items-center gap-2 px-6 py-3 rounded-full glass shadow-glass hover:shadow-glass-lg transition-all duration-300"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </motion.div>

            {/* Cycle Complete Message */}
            {rotationDay === 93 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-6 rounded-2xl glass shadow-glass-lg border-2 border-purple-500/20 text-center"
                >
                    <h3 className="text-2xl font-serif mb-2">Congratulations!</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                        You've completed the full 93-day journey through Presence, Healing, and Truth.
                        Continue to Day 1 to start a new cycle.
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default RotationDevotional;
