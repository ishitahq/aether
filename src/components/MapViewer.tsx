'use client';

import dynamic from 'next/dynamic';
import { LandsatImage } from '@/lib/mockData';

// Dynamically import the entire map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center">Loading map...</div>
});

interface MapViewerProps {
  landsatData: LandsatImage[];
  onMarkerClick: (image: LandsatImage) => void;
}

const MapViewer = ({ landsatData, onMarkerClick }: MapViewerProps) => {
  return (
    <div className="w-full h-full relative">
      <DynamicMap landsatData={landsatData} onMarkerClick={onMarkerClick} />
      
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