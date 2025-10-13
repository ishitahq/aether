'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import MapViewer from '@/components/MapViewer';
import DataModal from '@/components/DataModal';
import { mockLandsatData, LandsatImage } from '@/lib/mockData';

export default function MapPage() {
  const [selectedImage, setSelectedImage] = useState<LandsatImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<LandsatImage[]>(mockLandsatData);

  useEffect(() => {
    const filtered = mockLandsatData.filter(location =>
      location.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.metadata.tempRange.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm]);

  const handleMarkerClick = (image: LandsatImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      {/* Dynamic Background */}
      <div className="dynamic-bg"></div>
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="hexagon-overlay"></div>
        <div className="particle-container">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                x: [0, Math.random() * 50],
                y: [0, Math.random() * 50],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: Math.random() * 15 + 15,
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
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Thermal Data Map
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Explore thermal imagery across different locations worldwide. 
              Click on markers to view detailed thermal data and metadata.
            </p>
          </motion.div>

          {/* Map and Location List Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2 glass-morphism-dark rounded-3xl p-4 h-[70vh] min-h-[600px]"
            >
              <MapViewer
                landsatData={filteredData}
                onMarkerClick={handleMarkerClick}
              />
            </motion.div>

            {/* Location List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4"
            >
              <div className="glass-morphism-dark rounded-xl p-4">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">
                  Available Locations
                </h2>
                
                {/* Search Filter */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                  {filteredData.map((location, index) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
                      whileHover={{ y: -2 }}
                      onClick={() => handleMarkerClick(location)}
                      className="glass-morphism-dark rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-slate-100 text-sm">{location.location}</h3>
                          <p className="text-xs text-slate-400">{location.acquisitionDate}</p>
                          <p className="text-xs text-slate-500">
                            {location.coordinates[0].toFixed(2)}°, {location.coordinates[1].toFixed(2)}°
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-300">{location.metadata.tempRange}</div>
                          <div className="text-xs text-slate-500">{location.metadata.cloudCover}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {[
              {
                title: 'Total Locations',
                value: mockLandsatData.length.toString(),
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Coverage Area',
                value: 'Global',
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Data Resolution',
                value: '30m',
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Satellite',
                value: 'Landsat 8',
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
                color: 'from-orange-500 to-red-500'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card-dark text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-1">{stat.value}</h3>
                <p className="text-slate-400 text-sm">{stat.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Data Modal */}
      <DataModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageData={selectedImage}
      />
    </div>
  );
}
