'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowDownTrayIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { LandsatImage } from '@/lib/mockData';
import TifViewer from './TifViewer';
import { TifProcessor } from '@/lib/geotiff';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: LandsatImage | null;
}

const DataModal = ({ isOpen, onClose, imageData }: DataModalProps) => {
  const [activeTab, setActiveTab] = useState<'thermal' | 'optical' | 'processed' | 'metadata'>('thermal');
  const [thermalProcessor, setThermalProcessor] = useState<TifProcessor | null>(null);
  const [opticalProcessor, setOpticalProcessor] = useState<TifProcessor | null>(null);
  const [processedProcessor, setProcessedProcessor] = useState<TifProcessor | null>(null);

  useEffect(() => {
    if (imageData && isOpen) {
      // Create mock processors for each image type
      const createMockProcessor = async (type: string) => {
        const processor = new TifProcessor();
        await processor.loadFromFile(new File(['mock'], `${type}.tif`, { type: 'image/tiff' }));
        return processor;
      };

      Promise.all([
        createMockProcessor('thermal'),
        createMockProcessor('optical'),
        createMockProcessor('processed')
      ]).then(([thermal, optical, processed]) => {
        setThermalProcessor(thermal);
        setOpticalProcessor(optical);
        setProcessedProcessor(processed);
      });
    }
  }, [imageData, isOpen]);

  const handleDownload = async () => {
    if (processedProcessor) {
      try {
        await processedProcessor.downloadAsTif(`${imageData?.location.toLowerCase().replace(/\s+/g, '-')}-processed.tif`);
      } catch (error) {
        // Handle download error silently
      }
    }
  };

  if (!isOpen || !imageData) return null;

  const tabs = [
    { id: 'processed', label: 'Processed Image', processor: processedProcessor },
    { id: 'metadata', label: 'Metadata', processor: null }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 backdrop-blur-xl bg-black/60 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="glass-morphism-dark rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{imageData.location}</h2>
              <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{imageData.acquisitionDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{imageData.coordinates[0].toFixed(4)}°, {imageData.coordinates[1].toFixed(4)}°</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-slate-400" />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  px-6 py-4 text-sm font-medium transition-colors relative
                  ${activeTab === tab.id 
                    ? 'text-blue-400' 
                    : 'text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <AnimatePresence mode="wait">
              {activeTab === 'metadata' ? (
                <motion.div
                  key="metadata"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Satellite Information */}
                  <div className="glass-morphism-dark rounded-xl p-6 border-2 border-slate-600/50">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Satellite Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400">Satellite:</span>
                        <span className="text-slate-200 ml-2">{imageData.metadata.satellite}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Sensor:</span>
                        <span className="text-slate-200 ml-2">{imageData.metadata.sensor}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Path:</span>
                        <span className="text-slate-200 ml-2">{imageData.metadata.path}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Row:</span>
                        <span className="text-slate-200 ml-2">{imageData.metadata.row}</span>
                      </div>
                    </div>
                  </div>

                  {/* Image Properties */}
                  <div className="glass-morphism-dark rounded-xl p-6 border-2 border-slate-600/50">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Image Properties</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400">Resolution:</span>
                        <span className="text-slate-200 ml-2">{imageData.metadata.resolution}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Temperature Range:</span>
                        <span className="text-slate-200 ml-2">{imageData.metadata.tempRange}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Cloud Cover:</span>
                        <span className="text-slate-200 ml-2">{imageData.metadata.cloudCover}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Acquisition Date:</span>
                        <span className="text-slate-200 ml-2">{imageData.acquisitionDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Download File */}
                  <div className="glass-morphism-dark rounded-xl p-6 border-2 border-slate-600/50">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Download Processed Image</h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownload}
                      disabled={!processedProcessor}
                      className={`
                        w-full p-4 rounded-xl border transition-all duration-300
                        ${processedProcessor 
                          ? 'border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10' 
                          : 'border-slate-600 bg-slate-800/50 cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="text-center">
                        <ArrowDownTrayIcon className={`w-8 h-8 mx-auto mb-2 ${processedProcessor ? 'text-blue-400' : 'text-slate-500'}`} />
                        <p className={`text-sm font-medium ${processedProcessor ? 'text-slate-200' : 'text-slate-500'}`}>
                          Processed TIF
                        </p>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <TifViewer
                    processor={tabs.find(t => t.id === activeTab)?.processor || null}
                    title={`${tabs.find(t => t.id === activeTab)?.label}`}
                    showDownload={true}
                    onDownload={handleDownload}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DataModal;
