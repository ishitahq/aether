'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import TifUploader from '@/components/TifUploader';
import TifViewer from '@/components/TifViewer';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import { TifProcessor } from '@/lib/geotiff';

export default function HomePage() {
  const [inputProcessor, setInputProcessor] = useState<TifProcessor | null>(null);
  const [outputProcessor, setOutputProcessor] = useState<TifProcessor | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('Initializing AI processing...');
  const [error, setError] = useState<string | null>(null);

  const handleFileLoad = (processor: TifProcessor) => {
    setInputProcessor(processor);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const startProcessing = async () => {
    if (!inputProcessor) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingMessage('Initializing AI processing...');

    try {
      // Simulate processing steps with progress updates
      const steps = [
        { progress: 20, message: 'Loading thermal data...' },
        { progress: 40, message: 'Aligning with optical imagery...' },
        { progress: 60, message: 'Applying super-resolution algorithms...' },
        { progress: 80, message: 'Enhancing thermal fidelity...' },
        { progress: 95, message: 'Generating final output...' },
        { progress: 100, message: 'Processing complete!' }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProcessingProgress(step.progress);
        setProcessingMessage(step.message);
      }

      // Create mock output processor
      const mockOutput = new TifProcessor();
      await mockOutput.loadFromFile(new File(['mock'], 'processed.tif', { type: 'image/tiff' }));
      setOutputProcessor(mockOutput);

    } catch (error) {
      console.error('Processing error:', error);
      setError('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (outputProcessor) {
      try {
        await outputProcessor.downloadAsTif('super-resolved-thermal.tif');
      } catch (error) {
        setError('Download failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      {/* Dynamic Background */}
      <div className="dynamic-bg"></div>
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="hexagon-overlay"></div>
        <div className="particle-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                x: [0, Math.random() * 100],
                y: [0, Math.random() * 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-gradient mb-4">
              Aether
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Transform thermal imagery into high-resolution insights with advanced processing algorithms.
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Processing Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TifUploader
                onFileLoad={handleFileLoad}
                onError={handleError}
                isLoading={isProcessing}
              />
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <TifViewer
                processor={outputProcessor}
                title="Super-Resolved Output"
                showDownload={!!outputProcessor}
                onDownload={handleDownload}
              />
            </motion.div>
          </div>

          {/* Processing Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startProcessing}
              disabled={!inputProcessor || isProcessing}
              className={`
                px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300
                ${inputProcessor && !isProcessing
                  ? 'btn-primary shadow-2xl shadow-blue-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }
              `}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Process Thermal Data</span>
                </div>
              )}
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: 'Multi-Sensor Alignment',
                description: 'Geometrically co-register high-resolution optical images with low-resolution TIR data',
                icon: (
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                title: 'Fusion of Modalities',
                description: 'Combine spatial detail from optical imagery with temperature fidelity from thermal imagery',
                icon: (
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )
              },
              {
                title: 'Super-Resolution',
                description: 'Up-sample coarse thermal data to finer spatial resolution guided by optical details',
                icon: (
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h4" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card-dark text-center"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Processing Animation Modal */}
      <ProcessingAnimation
        isProcessing={isProcessing}
        progress={processingProgress}
        message={processingMessage}
      />
    </div>
  );
}