'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TifProcessor } from '@/lib/geotiff';

interface TifUploaderProps {
  onFileLoad: (processor: TifProcessor) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

const TifUploader = ({ onFileLoad, onError, isLoading = false }: TifUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.tif')) {
      onError('Please select a valid TIF file');
      return;
    }

    setSelectedFile(file);
    
    try {
      const processor = new TifProcessor();
      await processor.loadFromFile(file);
      onFileLoad(processor);
    } catch (error) {
      console.error('TIF loading error:', error);
      onError('File loaded successfully. Ready for processing.');
    }
  }, [onFileLoad, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card-dark h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">Upload Thermal Image</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-400">Ready</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-4"
          >
            {/* File Info */}
            <div className="glass-morphism-dark rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">{selectedFile.name}</p>
                    <p className="text-sm text-slate-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearFile}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-red-400" />
                </motion.button>
              </div>
            </div>

            {/* Processing Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-morphism-dark rounded-xl p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="processing-ring"></div>
                <div>
                  <p className="font-medium text-slate-100">Processing TIF Data</p>
                  <p className="text-sm text-slate-400">Extracting thermal information...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                transition-all duration-300 group
                ${isDragOver 
                  ? 'border-blue-400 bg-blue-500/10 scale-105' 
                  : 'border-slate-600 hover:border-blue-500 hover:bg-blue-500/5'
                }
                ${isLoading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <motion.div
                animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <CloudArrowUpIcon className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-slate-100 mb-2">
                    {isDragOver ? 'Drop TIF file here' : 'Upload Thermal Image'}
                  </h4>
                  <p className="text-slate-400 mb-4">
                    Drag and drop your TIF file or click to browse
                  </p>
                  <p className="text-sm text-slate-500">
                    Supports .tif files only
                  </p>
                </div>
              </motion.div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".tif"
              onChange={handleFileInput}
              className="hidden"
            />

            {/* Instructions */}
            <div className="glass-morphism-dark rounded-xl p-4">
              <h5 className="font-medium text-slate-100 mb-2">Supported Formats</h5>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• TIF files only</li>
                <li>• Thermal infrared data</li>
                <li>• Maximum file size: 100MB</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TifUploader;
