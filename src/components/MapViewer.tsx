'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { LandsatImage } from '@/lib/mockData';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapViewerProps {
  landsatData: LandsatImage[];
  onMarkerClick: (image: LandsatImage) => void;
}

const MapViewer = ({ landsatData, onMarkerClick }: MapViewerProps) => {
  const mapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Custom marker icon
  const createCustomIcon = (isHovered: boolean = false) => {
    if (!isClient) return null;
    
    const L = require('leaflet');
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-container ${isHovered ? 'hovered' : ''}">
          <div class="marker-square">
            <div class="marker-inner"></div>
          </div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  useEffect(() => {
    if (isClient) {
      // Add custom CSS for markers
      const style = document.createElement('style');
      style.textContent = `
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .marker-container {
          position: relative;
          width: 20px;
          height: 20px;
          transition: all 0.3s ease;
        }
        
        .marker-square {
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border: 3px solid rgba(255, 255, 255, 1);
          border-radius: 6px;
          transform: rotate(45deg);
          position: relative;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .marker-container.hovered .marker-square {
          transform: rotate(45deg) scale(1.3);
          box-shadow: 0 0 25px rgba(59, 130, 246, 1);
          border-color: rgba(255, 255, 255, 1);
        }
        
        .marker-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          background: white !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isClient]);

  return (
    <div className="w-full h-full relative">
      {isClient ? (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          className="w-full h-full"
          ref={mapRef}
          style={{ 
            background: '#1e293b',
            borderRadius: '1rem',
            overflow: 'hidden'
          }}
        >
          {/* Regular OpenStreetMap tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          
          {/* Landsat markers */}
          {landsatData.map((image) => (
            <Marker
              key={image.id}
              position={image.coordinates}
              icon={createCustomIcon()}
              eventHandlers={{
                click: () => onMarkerClick(image),
                mouseover: (e) => {
                  const marker = e.target;
                  marker.setIcon(createCustomIcon(true));
                },
                mouseout: (e) => {
                  const marker = e.target;
                  marker.setIcon(createCustomIcon(false));
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-lg">{image.location}</h3>
                  <p className="text-sm text-gray-600 mt-1">{image.acquisitionDate}</p>
                  <p className="text-xs text-gray-500 mt-1">{image.metadata.satellite}</p>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600">Temperature: {image.metadata.tempRange}</p>
                    <p className="text-xs text-gray-600">Cloud Cover: {image.metadata.cloudCover}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center">
          <div className="text-slate-400">Loading map...</div>
        </div>
      )}
      
      {/* Map overlay with controls */}
      <div className="absolute top-4 right-4 z-[1000]">
        <div className="glass-morphism-dark rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-300">
              {landsatData.length} locations
            </span>
          </div>
        </div>
      </div>
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="glass-morphism-dark rounded-xl p-4">
          <h4 className="text-sm font-semibold text-slate-100 mb-2">Thermal Coverage</h4>
          <div className="space-y-1 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm"></div>
              <span>Thermal imagery available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-600 rounded-sm"></div>
              <span>No data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewer;