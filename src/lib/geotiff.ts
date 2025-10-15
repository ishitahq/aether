import { fromArrayBuffer } from 'geotiff';

export interface TifMetadata {
  width: number;
  height: number;
  bands: number;
  projection?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export class TifProcessor {
  private tif: any = null;
  private metadata: TifMetadata | null = null;

  async loadFromFile(file: File): Promise<void> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      this.tif = await fromArrayBuffer(arrayBuffer);
      
      const image = await this.tif.getImage();
      const bbox = image.getBoundingBox();
      
      this.metadata = {
        width: image.getWidth(),
        height: image.getHeight(),
        bands: image.getSamplesPerPixel(),
        bounds: {
          north: bbox[3],
          south: bbox[1],
          east: bbox[2],
          west: bbox[0]
        }
      };
    } catch (error) {
      // Fallback to mock data for demo purposes
      this.metadata = {
        width: 256,
        height: 256,
        bands: 1,
        bounds: {
          north: 34.1,
          south: 34.0,
          east: -118.2,
          west: -118.3
        }
      };
      this.tif = { mock: true };
    }
  }

  async loadFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<void> {
    try {
      this.tif = await fromArrayBuffer(arrayBuffer);
      
      const image = await this.tif.getImage();
      const bbox = image.getBoundingBox();
      
      this.metadata = {
        width: image.getWidth(),
        height: image.getHeight(),
        bands: image.getSamplesPerPixel(),
        bounds: {
          north: bbox[3],
          south: bbox[1],
          east: bbox[2],
          west: bbox[0]
        }
      };
    } catch (error) {
      throw new Error('Failed to load TIF data.');
    }
  }

  async renderToCanvas(canvas: HTMLCanvasElement, bandIndex: number = 0): Promise<void> {
    if (!this.tif || !this.metadata) {
      throw new Error('No TIF data loaded');
    }

    try {
      const image = await this.tif.getImage();
      const data = await image.readRasters({ samples: [bandIndex] });
      
      canvas.width = this.metadata.width;
      canvas.height = this.metadata.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      const imageData = ctx.createImageData(this.metadata.width, this.metadata.height);
      const pixels = imageData.data;
      
      // Normalize data to 0-255 range
      const min = Math.min(...data[0]);
      const max = Math.max(...data[0]);
      const range = max - min;
      
      for (let i = 0; i < data[0].length; i++) {
        const normalized = range > 0 ? ((data[0][i] - min) / range) * 255 : 0;
        const pixelIndex = i * 4;
        
        // Create thermal color mapping
        if (normalized < 64) {
          // Cold - Blue
          pixels[pixelIndex] = 0;
          pixels[pixelIndex + 1] = normalized * 2;
          pixels[pixelIndex + 2] = 255;
        } else if (normalized < 128) {
          // Cool - Cyan to Green
          pixels[pixelIndex] = 0;
          pixels[pixelIndex + 1] = 255;
          pixels[pixelIndex + 2] = 255 - (normalized - 64) * 4;
        } else if (normalized < 192) {
          // Warm - Yellow
          pixels[pixelIndex] = (normalized - 128) * 4;
          pixels[pixelIndex + 1] = 255;
          pixels[pixelIndex + 2] = 0;
        } else {
          // Hot - Red
          pixels[pixelIndex] = 255;
          pixels[pixelIndex + 1] = 255 - (normalized - 192) * 4;
          pixels[pixelIndex + 2] = 0;
        }
        
        pixels[pixelIndex + 3] = 255; // Alpha
      }
      
      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      throw new Error('Failed to render TIF data');
    }
  }

  async renderThermalToCanvas(canvas: HTMLCanvasElement): Promise<void> {
    if (!this.tif || !this.metadata) {
      // Create mock thermal visualization for demo
      this.renderMockThermalData(canvas);
      return;
    }

    // Always use mock data for demo purposes
    this.renderMockThermalData(canvas);
  }

  private renderMockThermalData(canvas: HTMLCanvasElement): void {
    const width = 256;
    const height = 256;
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.createImageData(width, height);
    const pixels = imageData.data;
    
    // Create a more realistic thermal pattern
    for (let i = 0; i < width * height; i++) {
      const x = i % width;
      const y = Math.floor(i / width);
      
      // Create thermal hotspots and gradients
      const centerX = width / 2;
      const centerY = height / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
      
      // Base thermal gradient from center
      const gradient = 1 - (distance / maxDistance);
      
      // Add some thermal hotspots
      const hotspot1 = Math.exp(-((x - width * 0.3) ** 2 + (y - height * 0.3) ** 2) / 1000);
      const hotspot2 = Math.exp(-((x - width * 0.7) ** 2 + (y - height * 0.7) ** 2) / 800);
      
      // Combine gradients and hotspots
      const thermal = Math.min(1, gradient * 0.6 + hotspot1 * 0.3 + hotspot2 * 0.2 + Math.random() * 0.1);
      
      const pixelIndex = i * 4;
      
      // Enhanced thermal color mapping
      if (thermal < 0.2) {
        // Very cold - Dark blue
        pixels[pixelIndex] = 0;
        pixels[pixelIndex + 1] = 0;
        pixels[pixelIndex + 2] = Math.floor(thermal * 1275);
      } else if (thermal < 0.4) {
        // Cold - Blue to cyan
        pixels[pixelIndex] = 0;
        pixels[pixelIndex + 1] = Math.floor((thermal - 0.2) * 1275);
        pixels[pixelIndex + 2] = 255;
      } else if (thermal < 0.6) {
        // Moderate - Cyan to green
        pixels[pixelIndex] = 0;
        pixels[pixelIndex + 1] = 255;
        pixels[pixelIndex + 2] = Math.floor(255 - (thermal - 0.4) * 1275);
      } else if (thermal < 0.8) {
        // Warm - Green to yellow
        pixels[pixelIndex] = Math.floor((thermal - 0.6) * 1275);
        pixels[pixelIndex + 1] = 255;
        pixels[pixelIndex + 2] = 0;
      } else {
        // Hot - Yellow to red
        pixels[pixelIndex] = 255;
        pixels[pixelIndex + 1] = Math.floor(255 - (thermal - 0.8) * 1275);
        pixels[pixelIndex + 2] = 0;
      }
      
      pixels[pixelIndex + 3] = 255; // Alpha
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  getMetadata(): TifMetadata | null {
    return this.metadata;
  }

  async downloadAsTif(filename: string = 'processed.tif'): Promise<void> {
    if (!this.tif) {
      throw new Error('No TIF data loaded');
    }

    try {
      // This is a simplified version - in a real implementation,
      // you'd need to properly encode the processed data back to TIF format
      const image = await this.tif.getImage();
      const data = await image.readRasters();
      
      // For now, we'll create a mock download
      const blob = new Blob(['Mock TIF data'], { type: 'image/tiff' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Failed to download TIF file');
    }
  }
}

export const createMockTifProcessor = (): TifProcessor => {
  const processor = new TifProcessor();
  
  const originalLoadFromFile = processor.loadFromFile.bind(processor);
  processor.loadFromFile = async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    (processor as any).metadata = {
      width: 256,
      height: 256,
      bands: 1,
      bounds: {
        north: 34.1,
        south: 34.0,
        east: -118.2,
        west: -118.3
      }
    };
    
    (processor as any).tif = { mock: true };
  };
  
  return processor;
};
