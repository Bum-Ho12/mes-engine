# Video Processing Framework Documentation

Comprehensive documentation for the mes-engine video processing framework.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Core Concepts](#core-concepts)
3. [Components](#components)
4. [Advanced Usage](#advanced-usage)
5. [API Reference](#api-reference)

## Getting Started

### Installation
```bash
npm install mes-engine
```

### Engine Requirements

#### FFmpeg Engine
```bash
npm install ffmpeg-static
```

#### GStreamer Engine
Requires GStreamer to be installed on your system:
- Ubuntu/Debian: `apt-get install gstreamer1.0-tools`
- MacOS: `brew install gstreamer`
- Windows: Download from GStreamer website

### Basic Configuration

```typescript
import { VideoProcessor, FFmpegEngine, FileSystemStorage } from 'mes-engine';

const config = {
  chunkSize: 10,          // seconds
  cacheDir: './cache',
  maxCacheSize: 1000,     // MB
  defaultQualities: [
    { height: 1080, bitrate: '4000k' },
    { height: 720, bitrate: '2500k' },
    { height: 480, bitrate: '1000k' }
  ]
};

const processor = new VideoProcessor({
  engine: new FFmpegEngine(),
  storage: new FileSystemStorage(),
  config
});
```

## Core Concepts

### Video Processing Flow

1. **Input**: Raw video file
2. **Chunking**: Video split into segments
3. **Transcoding**: Multiple quality versions
4. **Storage**: Chunks saved to storage provider
5. **Streaming**: Adaptive delivery

### Events System

```typescript
processor.on(VideoEvent.CHUNK_PROCESSED, (data) => {
  console.log(`Chunk ${data.chunkNumber} processed at ${data.quality}p`);
});

processor.on(VideoEvent.PROCESSING_COMPLETE, (manifest) => {
  console.log('Processing complete:', manifest);
});
```

## Components

### Processing Engines

- **FFmpegEngine**: Standard video processing
- **GStreamerEngine**: High-performance alternative
- **Custom Engines**: Extend `VideoEngine` class

```typescript
class CustomEngine extends VideoEngine {
  async processChunk(
    inputPath: string,
    outputPath: string,
    startTime: number,
    quality: QualityLevel
  ): Promise<void> {
    // Implementation
  }

  async getDuration(inputPath: string): Promise<number> {
    // Implementation
  }
}
```

### Storage Providers

- **FileSystemStorage**: Local file system storage
- **Custom Storage**: Implement `StorageProvider`

```typescript
class CustomStorage extends StorageProvider {
  async saveChunk(chunkPath: string, data: Buffer): Promise<void> {
    // Implementation
  }

  async getChunk(chunkPath: string): Promise<Buffer> {
    // Implementation
  }

  async deleteChunk(chunkPath: string): Promise<void> {
    // Implementation
  }
}
```

### Caching Strategies

- **InternalCache**: Memory-based LRU cache
- **ExternalCache**: Remote cache service
- **Custom Cache**: Extend `CacheStrategy`

## Advanced Usage

### Custom Quality Levels

```typescript
const customQualities = [
  { height: 2160, bitrate: '8000k' }, // 4K
  { height: 1440, bitrate: '6000k' }, // 2K
  { height: 1080, bitrate: '4000k' }, // Full HD
];

const manifest = await processor.processVideo('input.mp4', {
  qualities: customQualities
});
```

### Bandwidth-Aware Streaming

```typescript
import { BandwidthDetector } from 'mes-engine';

const detector = new BandwidthDetector();
detector.addSample(bytesTransferred, durationMs);
const estimatedBandwidth = detector.getEstimatedBandwidth();
```

## API Reference

See [API.md](./API.md) for detailed API documentation.

## Testing

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.