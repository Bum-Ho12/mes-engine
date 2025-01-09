# Video Processing Framework

## Installation
```bash
npm install video-processing-framework
```

## Features
- Video processing and streaming
- Multiple quality levels
- Chunk-based processing
- Internal/external caching
- Preload next chunk
- Customizable storage providers
- Event system

## Basic Usage
```typescript
import { VideoProcessor, FFmpegEngine, FileSystemStorage, InternalCache } from 'mes-engine';

const processor = new VideoProcessor({
  engine: new FFmpegEngine(),
  storage: new FileSystemStorage(),
  cache: new InternalCache({
    maxSize: 1000,
    ttl: 3600,
    preloadNextChunk: true
  })
});

// Process video
const manifest = await processor.processVideo('input.mp4');

// Stream with caching
const stream = await processor.streamChunk(manifest.videoId, 1080, 0);
```

## Custom Cache Implementation
```typescript
import { CacheStrategy } from 'mes-engine';

class CustomCache extends CacheStrategy {
  // Implement cache methods
}
```

## Documentation
See [docs/](./docs) for detailed documentation.