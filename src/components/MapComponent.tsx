'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LandsatImage } from '@/lib/mockData';
import L from 'leaflet';

// Create custom thermal marker icon
const createThermalMarkerIcon = (isHot: boolean = false) => {
  const color = isHot ? '#ef4444' : '#3b82f6'; // Red for hot, blue for cold
  const size = 20;
  
  const svgIcon = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="6" fill="white" opacity="0.8"/>
      <circle cx="12" cy="12" r="3" fill="${color}"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-thermal-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

interface MapComponentProps {
  landsatData: LandsatImage[];
  onMarkerClick: (image: LandsatImage) => void;
}

export default function MapComponent({ landsatData, onMarkerClick }: MapComponentProps) {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current && landsatData.length > 0) {
      const bounds = L.latLngBounds(
        landsatData.map(image => [image.coordinates[1], image.coordinates[0]] as [number, number])
      );
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [landsatData]);

  return (
    <MapContainer
      center={[20, 0] as [number, number]}
      zoom={2}
      className="w-full h-full"
      ref={mapRef}
      style={{ 
        background: '#1e293b',
        borderRadius: '1rem',
        overflow: 'hidden'
      }}
    >
      {/* Dark OpenStreetMap tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        maxZoom={20}
        errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      />

      {/* Markers for each Landsat image */}
      {landsatData.map((image, index) => {
        // Determine if location is hot based on temperature range
        const maxTemp = parseInt(image.metadata.tempRange.split('-')[1]?.replace('°C', '') || '0');
        const isHot = maxTemp > 30;
        
        return (
          <Marker
            key={index}
            position={[image.coordinates[1], image.coordinates[0]] as [number, number]}
            icon={createThermalMarkerIcon(isHot)}
            eventHandlers={{
              click: () => onMarkerClick(image),
            }}
          >
          <Popup>
            <div className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200">
              <h3 className="font-semibold text-slate-800 text-sm mb-1">{image.location}</h3>
              <p className="text-xs text-slate-600 mb-1">
                Date: {new Date(image.acquisitionDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-600 mb-1">
                Cloud Coverage: {image.metadata.cloudCover}
              </p>
              <p className="text-xs text-slate-600">
                Resolution: {image.metadata.resolution}
              </p>
            </div>
          </Popup>
        </Marker>
        );
      })}
    </MapContainer>
  );
}
