# mes-engine

A powerful and flexible video processing framework for Node.js with support for multiple processing engines, adaptive streaming, and intelligent caching.

[![npm version](https://badge.fury.io/js/mes-engine.svg)](https://badge.fury.io/js/mes-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎥 Multiple video processing engines (FFmpeg, GStreamer)
- 🔄 Adaptive streaming with quality switching
- 📦 Chunk-based processing for efficient streaming
- 💾 Flexible storage providers
- 🚀 Built-in caching strategies (internal/external)
- 📡 Event-driven architecture
- 🔌 Extensible plugin system

## Quick Start

### Installation

```bash
npm install mes-engine

# Install required engine
npm install ffmpeg-static  # For FFmpeg engine
# or
npm install gstreamer     # For GStreamer engine
```

### Basic Usage

```typescript
import { 
  VideoProcessor, 
  FFmpegEngine, 
  FileSystemStorage, 
  InternalCache 
} from 'mes-engine';

// Initialize processor
const processor = new VideoProcessor({
  engine: new FFmpegEngine(),
  storage: new FileSystemStorage(),
  cache: new InternalCache({
    maxSize: 1024 * 1024 * 100, // 100MB
    ttl: 3600,
    preloadNextChunk: true
  })
});

// Process video
const manifest = await processor.processVideo('input.mp4');

// Stream video chunk
const stream = await processor.streamChunk(
  manifest.videoId,
  720, // quality
  0    // chunk number
);
```

## Documentation

Full documentation is available in the [docs directory](./docs).

### Key Topics:
- [Getting Started](./docs/getting-started.md)
- [Video Engines](./docs/engines.md)
- [Storage Providers](./docs/storage.md)
- [Caching Strategies](./docs/caching.md)
- [API Reference](./docs/api.md)

## Supported Engines

- **FFmpegEngine**: Full-featured video processing using FFmpeg
- **GStreamerEngine**: High-performance processing using GStreamer
- **Custom Engines**: Create your own by extending `VideoEngine`

## Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT © [Bumho Nisubire]