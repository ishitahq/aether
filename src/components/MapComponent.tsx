'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LandsatImage } from '@/lib/mockData';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
      {/* Regular OpenStreetMap tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Satellite imagery tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        opacity={0.7}
      />

      {/* Markers for each Landsat image */}
      {landsatData.map((image, index) => (
        <Marker
          key={index}
          position={[image.coordinates[1], image.coordinates[0]] as [number, number]}
          eventHandlers={{
            click: () => onMarkerClick(image),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">{image.location}</h3>
              <p className="text-xs text-gray-600 mb-1">
                Date: {new Date(image.acquisitionDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Cloud Coverage: {image.metadata.cloudCover}
              </p>
              <p className="text-xs text-gray-600">
                Resolution: {image.metadata.resolution}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
