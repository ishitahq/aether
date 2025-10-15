'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ProcessingAnimationProps {
  isProcessing: boolean;
  progress?: number;
  message?: string;
}

const ProcessingAnimation = ({ isProcessing, progress = 0, message = 'Processing thermal data...' }: ProcessingAnimationProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isProcessing) {
      // Generate random particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    }
  }, [isProcessing]);

  if (!isProcessing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop"
    >
      {/* Blurred dark backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      <div className="glass-morphism-dark rounded-3xl p-8 max-w-md mx-4 text-center relative">
        {/* Main Processing Ring */}
        <div className="relative mx-auto mb-6">
          <div className="w-32 h-32 mx-auto">
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-4 border-blue-500/20 rounded-full"
            />
            
            {/* Middle Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 border-3 border-purple-500/30 rounded-full"
            />
            
            {/* Inner Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-4 border-2 border-cyan-500/40 rounded-full"
            />
            
            {/* Center Glow */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20"
            />
          </div>
          
          {/* Floating Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                x: particle.x, 
                y: particle.y, 
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                x: particle.x + (Math.random() - 0.5) * 50,
                y: particle.y + (Math.random() - 0.5) * 50,
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeInOut'
              }}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Processing Progress</span>
            <span className="text-sm text-blue-400 font-medium">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full relative"
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* Status Message */}
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-2">AI Processing</h3>
          <p className="text-slate-400 text-sm">{message}</p>
        </motion.div>

        {/* Processing Steps */}
        <div className="mt-6 space-y-2">
          {[
            { step: 'Loading thermal data', completed: progress > 20 },
            { step: 'Aligning with optical imagery', completed: progress > 40 },
            { step: 'Applying super-resolution', completed: progress > 70 },
            { step: 'Generating output', completed: progress > 90 }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 text-sm"
            >
              <motion.div
                animate={{ 
                  scale: item.completed ? 1 : 0.8,
                  backgroundColor: item.completed ? '#10b981' : '#6b7280'
                }}
                className="w-3 h-3 rounded-full"
              />
              <span className={item.completed ? 'text-green-400' : 'text-slate-500'}>
                {item.step}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Hexagon Pattern Background */}
        <div className="absolute inset-0 hexagon-overlay opacity-5 pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default ProcessingAnimation;
