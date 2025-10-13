# Thermal Image Refiner

A stunning frontend application for thermal image super-resolution using AI-powered techniques. This application provides an intuitive interface for processing thermal imagery and exploring Landsat 8 satellite data.

## Features

### 🏠 Home Page - TIF Processing Interface
- **Drag & Drop Upload**: Intuitive TIF file uploader with visual feedback
- **Real-time Rendering**: GeoTIFF visualization using canvas-based rendering
- **AI Processing**: Mock super-resolution processing with animated progress
- **Download Support**: Export processed thermal imagery
- **Glass-morphism Design**: Modern Apple-inspired UI with sci-fi elements

### 🗺️ Map Page - Landsat 8 Imagery Explorer
- **Interactive World Map**: Leaflet-based map with dark theme
- **Custom Markers**: Animated thermal data markers at 7 global locations
- **Detailed Modals**: Comprehensive data viewer with metadata
- **Multi-format Support**: View thermal, optical, and processed imagery
- **Download Capabilities**: Export all image formats

## Tech Stack

- **Framework**: Next.js 14 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom glass-morphism utilities
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **TIF Processing**: GeoTIFF.js for client-side TIF rendering
- **Mapping**: Leaflet + React-Leaflet with OpenStreetMap tiles
- **Icons**: Heroicons for consistent iconography

## Design System

### Glass-Morphism Elements
- Backdrop blur effects with translucent backgrounds
- Subtle borders and glowing shadows
- Smooth hover transitions and scale effects

### Sci-Fi Aesthetics
- Animated gradient backgrounds (blue → purple → teal)
- Particle system with floating elements
- Hexagonal grid overlays
- Pulsing glow effects on interactive elements

### Color Palette
- **Primary**: Electric Blue (#3B82F6) with cyan accents
- **Secondary**: Deep Purple (#8B5CF6) for gradients
- **Neutral**: Slate grays with high contrast
- **Accents**: Cyan (#06B6D4) for interactive elements

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd thermal-image-refiner
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
thermal-image-refiner/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Home page (TIF processor)
│   │   └── map/
│   │       ├── layout.tsx       # Map page layout
│   │       └── page.tsx        # Map page
│   ├── components/
│   │   ├── Navigation.tsx       # Glass-morphic navbar
│   │   ├── TifUploader.tsx    # Drag-drop TIF uploader
│   │   ├── TifViewer.tsx       # GeoTIFF renderer
│   │   ├── ProcessingAnimation.tsx # Sci-fi processing animation
│   │   ├── MapViewer.tsx       # Leaflet map component
│   │   └── DataModal.tsx       # Image metadata modal
│   ├── lib/
│   │   ├── geotiff.ts          # GeoTIFF processing utilities
│   │   ├── mockData.ts         # Landsat 8 mock dataset
│   │   └── mockTifGenerator.ts # Mock TIF file generator
│   └── styles/
│       └── globals.css         # Global styles + animations
├── public/
│   └── mock-landsat/           # Mock Landsat 8 TIF files
└── package.json
```

## Mock Dataset

The application includes a mock dataset with 7 global locations:

1. **Los Angeles, CA** - Urban thermal patterns
2. **Amazon Rainforest** - Tropical forest monitoring
3. **Sahara Desert** - Extreme temperature variations
4. **Tokyo, Japan** - Dense urban heat island
5. **Greenland Ice Sheet** - Polar thermal analysis
6. **Great Barrier Reef** - Marine thermal monitoring
7. **Himalayas** - High-altitude thermal patterns

Each location includes:
- Low-resolution thermal TIF
- High-resolution optical TIF (mock)
- Processed super-resolved output
- Comprehensive metadata (resolution, temperature range, cloud cover, etc.)

## Key Features

### TIF Processing
- **Client-side Rendering**: Uses GeoTIFF.js for browser-based TIF processing
- **Thermal Color Mapping**: Enhanced thermal visualization with temperature scales
- **Zoom & Pan**: Interactive canvas controls for detailed inspection
- **Metadata Display**: Complete image information and geospatial data

### Interactive Map
- **Custom Markers**: Animated square markers with hover effects
- **Dark Theme**: Professional dark map tiles for better thermal visualization
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Smooth Animations**: Framer Motion-powered transitions

### Processing Animation
- **Multi-ring Progress**: Concentric rotating rings with particle effects
- **Step-by-step Updates**: Real-time processing status with progress bars
- **Sci-fi Aesthetics**: Glowing effects and floating particles
- **Smooth Transitions**: Elegant modal animations

## Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Next.js automatic image optimization
- **Efficient Animations**: Hardware-accelerated CSS animations
- **Memory Management**: Proper cleanup of canvas and event listeners

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Landsat 8**: Satellite imagery data
- **GeoTIFF.js**: Client-side TIF processing
- **Leaflet**: Interactive mapping
- **Framer Motion**: Animation library
- **Tailwind CSS**: Utility-first CSS framework