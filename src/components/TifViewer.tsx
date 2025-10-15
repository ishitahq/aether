'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownTrayIcon, MagnifyingGlassIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { TifProcessor, TifMetadata } from '@/lib/geotiff';

interface TifViewerProps {
  processor: TifProcessor | null;
  title: string;
  showDownload?: boolean;
  onDownload?: () => void;
  className?: string;
  imageUrl?: string; // optional direct image to render
}

const TifViewer = ({ 
  processor, 
  title, 
  showDownload = false, 
  onDownload,
  className = '',
  imageUrl
}: TifViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [metadata, setMetadata] = useState<TifMetadata | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (processor) {
      const meta = processor.getMetadata();
      setMetadata(meta);
      renderTif();
    }
  }, [processor]);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Display the provided image, but show fixed metadata values as requested
      setMetadata({
        width: 264,
        height: 264,
        bands: 11,
        bounds: {
          east: -114.5199,
          west: -114.427,
          north: 41.604,
          south: 41.535,
        },
      });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const renderTif = async () => {
    if (!processor || !canvasRef.current) return;

    setIsRendering(true);
    try {
      await processor.renderThermalToCanvas(canvasRef.current);
    } catch (error) {
      console.error('Error rendering TIF:', error);
    } finally {
      setIsRendering(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card-dark h-full ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${processor ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
          <span className="text-sm text-slate-400">
            {processor ? 'Loaded' : 'No Data'}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {(imageUrl || (processor && metadata)) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleZoomOut}
                  className="p-2 glass-morphism-dark rounded-lg hover:bg-white/10 transition-colors"
                >
                  <MagnifyingGlassIcon className="w-4 h-4 text-slate-300" />
                </motion.button>
                
                <span className="text-sm text-slate-400 px-2">
                  {Math.round(zoom * 100)}%
                </span>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleZoomIn}
                  className="p-2 glass-morphism-dark rounded-lg hover:bg-white/10 transition-colors"
                >
                  <MagnifyingGlassIcon className="w-4 h-4 text-slate-300 rotate-180" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResetZoom}
                  className="px-3 py-1 text-xs glass-morphism-dark rounded-lg hover:bg-white/10 transition-colors"
                >
                  Reset
                </motion.button>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFullscreen}
                  className="p-2 glass-morphism-dark rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ArrowsPointingOutIcon className="w-4 h-4 text-slate-300" />
                </motion.button>
                
                {showDownload && onDownload && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onDownload}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Image + Metadata Sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Image Container */}
              <div
                ref={containerRef}
                className={`
                  relative glass-morphism-dark rounded-xl overflow-hidden md:col-span-2
                  ${isFullscreen ? 'fixed inset-4 z-50' : ''}
                `}
              >
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto max-h-96 object-contain"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: 'center',
                      transition: 'transform 0.3s ease'
                    }}
                  />

                  {/* Loading Overlay */}
                  <AnimatePresence>
                    {isRendering && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                      >
                        <div className="text-center">
                          <div className="processing-ring mx-auto mb-4"></div>
                          <p className="text-white font-medium">Rendering Thermal Data...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Temperature Scale removed as requested */}
                </div>
              </div>

              {/* Metadata Sidebar */}
              {metadata && (
                <div className="glass-morphism-dark rounded-xl p-4">
                  <h5 className="text-sm font-medium text-slate-100 mb-3">Image Properties</h5>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-slate-400">Dimensions</div>
                      <div className="text-slate-200">{metadata.width} × {metadata.height}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Bands</div>
                      <div className="text-slate-200">{metadata.bands}</div>
                    </div>
                    {metadata.bounds && (
                      <div className="space-y-2">
                        <div>
                          <div className="text-slate-400">North</div>
                          <div className="text-slate-200">{metadata.bounds.north.toFixed(4)}°</div>
                        </div>
                        <div>
                          <div className="text-slate-400">South</div>
                          <div className="text-slate-200">{metadata.bounds.south.toFixed(4)}°</div>
                        </div>
                        <div>
                          <div className="text-slate-400">East</div>
                          <div className="text-slate-200">{metadata.bounds.east.toFixed(4)}°</div>
                        </div>
                        <div>
                          <div className="text-slate-400">West</div>
                          <div className="text-slate-200">{metadata.bounds.west.toFixed(4)}°</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-64 glass-morphism-dark rounded-xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400">No image loaded</p>
              <p className="text-sm text-slate-500 mt-1">Upload a TIF file to view data</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TifViewer;
