import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ color = '#3B82F6' }) => {
  return (
    <motion.div
      className="relative w-12 h-12"
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div 
        className="absolute w-full h-full rounded-full opacity-25"
        style={{ border: `4px solid ${color}` }}
      />
      <div 
        className="absolute w-full h-full rounded-full animate-spin"
        style={{ 
          borderTop: `4px solid transparent`,
          borderRight: `4px solid transparent`,
          borderBottom: `4px solid transparent`,
          borderLeft: `4px solid ${color}`,
        }}
      />
    </motion.div>
  );
};

export default LoadingSpinner;