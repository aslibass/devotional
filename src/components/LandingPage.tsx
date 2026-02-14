import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Lightbulb, ArrowRight, Users, BookOpen, Cross, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LandingPageProps {
    onBeginJourney: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onBeginJourney }) => {
    const { isDarkMode } = useTheme();

    const themes = [
        {
            icon: Sparkles,
            name: 'Presence',
            color: '#9333ea',
            gradient: 'from-purple-500 to-pink-500',
            description: 'Awaken to the sacred ordinary—practice God\'s presence not just in prayer, but in washing dishes, walking to work, and sitting in silence',
            guides: 7,
            featured: ['Brother Lawrence', 'Dallas Willard', 'Eugene Peterson']
        },
        {
            icon: Heart,
            name: 'Healing',
            color: '#10b981',
            gradient: 'from-emerald-500 to-teal-500',
            description: 'Bring your brokenness to the Healer—journey from shame to wholeness as God\'s compassion reaches the wounded places you\'ve hidden',
            guides: 7,
            featured: ['Thom Gardner', 'Dan Allender', 'Beth Moore']
        },
        {
            icon: Lightbulb,
            name: 'Truth',
            color: '#f59e0b',
            gradient: 'from-amber-500 to-orange-500',
            description: 'Discover truth that anchors your soul—explore the intellectual foundations and liberating realities that shatter lies and ignite hope',
            guides: 10,
            featured: ['C.S. Lewis', 'John Lennox', 'Nancy Pearcey']
        }
    ];

    const features = [
        {
            icon: BookOpen,
            title: 'Centuries of Wisdom',
            description: 'Scripture-grounded insights from 20 trusted teachers—from Brother Lawrence\'s 17th-century monastery to today\'s leading theologians'
        },
        {
            icon: Cross,
            title: 'Gospel-Centered',
            description: 'Every reflection points you to Christ—not self-improvement, but transformation through encounter with the living God'
        },
        {
            icon: Calendar,
            title: 'Quarterly Rhythm',
            description: 'A sustainable pattern that cycles through Presence, Healing, and Truth each season—no pressure, just daily grace'
        }
    ];

    return (
        <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Animated gradient background */}
            <div className="fixed inset-0 gradient-mesh opacity-30" />

            <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-20">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {/* Tagline */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle shadow-glass mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                            For the weary, wounded, and wondering
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <h1 className={`text-4xl sm:text-5xl md:text-6xl font-serif mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-wrap items-center justify-center gap-2 sm:gap-3`}>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Presence
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-purple-500"
                        >
                            |
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            Healing
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-emerald-500"
                        >
                            |
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            Truth
                        </motion.span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className={`text-xl sm:text-2xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto font-light leading-relaxed`}
                    >
                        Encounter the living God in His majesty, mercy, and truth—a quarterly rhythm of daily devotion that meets you where you are and gently leads you deeper
                    </motion.p>

                    {/* CTA Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9, type: "spring" }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onBeginJourney}
                        className="group px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-glow-purple hover:shadow-glow-purple-lg transition-all duration-300 flex items-center gap-3 mx-auto animate-float"
                    >
                        <span className="text-lg">Begin Today</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        className={`mt-4 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
                    >
                        10-15 minutes daily • Your reflections remain private
                    </motion.p>
                </motion.div>

                {/* Theme Cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="grid md:grid-cols-3 gap-6 mb-16"
                >
                    {themes.map((theme, index) => {
                        const Icon = theme.icon;
                        return (
                            <motion.div
                                key={theme.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + index * 0.15, duration: 0.5, type: "spring" }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="rounded-2xl p-8 glass shadow-glass-lg hover:shadow-glass-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                            >
                                {/* Glow effect */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-2xl"
                                    style={{ background: theme.color }}
                                />

                                {/* Icon */}
                                <motion.div
                                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                    whileHover={{ rotate: 5 }}
                                >
                                    <Icon className="w-8 h-8 text-white" />
                                </motion.div>

                                {/* Content */}
                                <h3 className={`text-2xl font-serif mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {theme.name}
                                </h3>
                                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                                    {theme.description}
                                </p>

                                {/* Guides count */}
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="w-4 h-4" style={{ color: theme.color }} />
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {theme.guides} Spiritual Guides
                                    </span>
                                </div>

                                {/* Featured authors */}
                                <div className="space-y-1">
                                    {theme.featured.map((author, i) => (
                                        <div key={i} className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                            • {author}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="mb-16"
                >
                    <h2 className={`text-3xl font-serif text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Rooted in Scripture, Guided by Trusted Teachers
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.7 + index * 0.1 }}
                                    className="p-6 rounded-xl glass-subtle shadow-glass hover:shadow-glass-lg transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0 }}
                    className="text-center glass-subtle rounded-2xl p-8 shadow-glass"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Users className="w-6 h-6 text-purple-500" />
                        <h3 className={`text-xl font-serif ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Wisdom from Trusted Voices
                        </h3>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed mb-4`}>
                        Drawing from 20 spiritual teachers who have shaped Christian contemplative practice across centuries—contemplatives, theologians, apologists, and spiritual directors who point us to Christ.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                        {['Brother Lawrence', 'C.S. Lewis', 'Dallas Willard', 'A.W. Tozer', 'Beth Moore', 'Eugene Peterson'].map((name) => (
                            <span
                                key={name}
                                className={`px-3 py-1 rounded-full glass-subtle ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                            >
                                {name}
                            </span>
                        ))}
                        <span className={`px-3 py-1 rounded-full ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} font-medium`}>
                            +14 more
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
