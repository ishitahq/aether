export interface LandsatImage {
  id: string;
  location: string;
  coordinates: [number, number];
  acquisitionDate: string;
  thermalTif: string;
  opticalTif: string;
  processedTif: string;
  metadata: {
    resolution: string;
    tempRange: string;
    cloudCover: string;
    sensor: string;
    satellite: string;
    path: string;
    row: string;
  };
}

export const mockLandsatData: LandsatImage[] = [
  {
    id: 'landsat-001',
    location: 'Los Angeles, CA',
    coordinates: [-118.2437, 34.0522],
    acquisitionDate: '2024-01-15',
    thermalTif: '/mock-landsat/la-thermal.tif',
    opticalTif: '/mock-landsat/la-optical.tif',
    processedTif: '/mock-landsat/la-processed.tif',
    metadata: {
      resolution: '30m',
      tempRange: '15°C - 45°C',
      cloudCover: '5%',
      sensor: 'TIRS-2',
      satellite: 'Landsat 8',
      path: '042',
      row: '036'
    }
  },
  {
    id: 'landsat-002',
    location: 'Amazon Rainforest',
    coordinates: [-60.0215, -3.4653],
    acquisitionDate: '2024-01-20',
    thermalTif: '/mock-landsat/amazon-thermal.tif',
    opticalTif: '/mock-landsat/amazon-optical.tif',
    processedTif: '/mock-landsat/amazon-processed.tif',
    metadata: {
      resolution: '30m',
      tempRange: '22°C - 35°C',
      cloudCover: '15%',
      sensor: 'TIRS-2',
      satellite: 'Landsat 8',
      path: '231',
      row: '062'
    }
  },
  {
    id: 'landsat-003',
    location: 'Sahara Desert',
    coordinates: [8.2275, 26.0975],
    acquisitionDate: '2024-01-25',
    thermalTif: '/mock-landsat/sahara-thermal.tif',
    opticalTif: '/mock-landsat/sahara-optical.tif',
    processedTif: '/mock-landsat/sahara-processed.tif',
    metadata: {
      resolution: '30m',
      tempRange: '25°C - 55°C',
      cloudCover: '2%',
      sensor: 'TIRS-2',
      satellite: 'Landsat 8',
      path: '201',
      row: '041'
    }
  },
  {
    id: 'landsat-004',
    location: 'Tokyo, Japan',
    coordinates: [139.6917, 35.6895],
    acquisitionDate: '2024-02-01',
    thermalTif: '/mock-landsat/tokyo-thermal.tif',
    opticalTif: '/mock-landsat/tokyo-optical.tif',
    processedTif: '/mock-landsat/tokyo-processed.tif',
    metadata: {
      resolution: '30m',
      tempRange: '5°C - 30°C',
      cloudCover: '8%',
      sensor: 'TIRS-2',
      satellite: 'Landsat 8',
      path: '107',
      row: '035'
    }
  },
  {
    id: 'landsat-005',
    location: 'Greenland Ice Sheet',
    coordinates: [-42.6043, 71.7069],
    acquisitionDate: '2024-02-05',
    thermalTif: '/mock-landsat/greenland-thermal.tif',
    opticalTif: '/mock-landsat/greenland-optical.tif',
    processedTif: '/mock-landsat/greenland-processed.tif',
    metadata: {
      resolution: '30m',
      tempRange: '-25°C - 5°C',
      cloudCover: '12%',
      sensor: 'TIRS-2',
      satellite: 'Landsat 8',
      path: '013',
      row: '010'
    }
  },
  {
    id: 'landsat-006',
    location: 'Great Barrier Reef',
    coordinates: [145.7750, -16.2905],
    acquisitionDate: '2024-02-10',
    thermalTif: '/mock-landsat/reef-thermal.tif',
    opticalTif: '/mock-landsat/reef-optical.tif',
    processedTif: '/mock-landsat/reef-processed.tif',
    metadata: {
      resolution: '30m',
      tempRange: '20°C - 28°C',
      cloudCover: '10%',
      sensor: 'TIRS-2',
      satellite: 'Landsat 8',
      path: '094',
      row: '075'
    }
  },
  {
    id: 'landsat-007',
    location: 'Himalayas',
    coordinates: [86.9250, 27.9881],
    acquisitionDate: '2024-02-15',
    thermalTif: '/mock-landsat/himalayas-thermal.tif',
    opticalTif: '/mock-landsat/himalayas-optical.tif',
    processedTif: '/mock-landsat/himalayas-processed.tif',
    metadata: {
      resolution: '30m',
      tempRange: '-10°C - 20°C',
      cloudCover: '20%',
      sensor: 'TIRS-2',
      satellite: 'Landsat 8',
      path: '142',
      row: '040'
    }
  }
];

export const generateMockTifData = (width: number = 256, height: number = 256): ImageData => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Create a gradient pattern simulating thermal data
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#000080'); // Cold (blue)
  gradient.addColorStop(0.3, '#0080ff'); // Cool (light blue)
  gradient.addColorStop(0.5, '#00ff00'); // Moderate (green)
  gradient.addColorStop(0.7, '#ffff00'); // Warm (yellow)
  gradient.addColorStop(1, '#ff0000'); // Hot (red)
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add some noise/texture
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
  }
  
  ctx.putImageData(imageData, 0, 0);
  return ctx.getImageData(0, 0, width, height);
};
