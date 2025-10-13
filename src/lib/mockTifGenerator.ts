// Mock TIF file generator for demo purposes
// This creates placeholder TIF files that simulate Landsat 8 thermal data

const generateMockTifFile = (name: string, width: number = 256, height: number = 256): string => {
  // Create a canvas to generate thermal-like data
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Create thermal gradient pattern
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
  gradient.addColorStop(0, '#000080'); // Cold center (blue)
  gradient.addColorStop(0.3, '#0080ff'); // Cool (light blue)
  gradient.addColorStop(0.5, '#00ff00'); // Moderate (green)
  gradient.addColorStop(0.7, '#ffff00'); // Warm (yellow)
  gradient.addColorStop(1, '#ff0000'); // Hot edges (red)
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add thermal noise/texture
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 40;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Convert to data URL for download
  return canvas.toDataURL('image/png');
};

// Generate mock TIF files for all locations
export const generateMockTifFiles = () => {
  const locations = [
    'la-thermal', 'la-optical', 'la-processed',
    'amazon-thermal', 'amazon-optical', 'amazon-processed',
    'sahara-thermal', 'sahara-optical', 'sahara-processed',
    'tokyo-thermal', 'tokyo-optical', 'tokyo-processed',
    'greenland-thermal', 'greenland-optical', 'greenland-processed',
    'reef-thermal', 'reef-optical', 'reef-processed',
    'himalayas-thermal', 'himalayas-optical', 'himalayas-processed'
  ];
  
  const files: Record<string, string> = {};
  
  locations.forEach(location => {
    files[location] = generateMockTifFile(location);
  });
  
  return files;
};

// Mock file download function
export const downloadMockTif = (filename: string, dataUrl: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.png`; // Using PNG for demo
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
