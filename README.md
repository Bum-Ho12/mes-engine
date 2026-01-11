# mes-engine

A powerful and flexible video processing framework for Node.js with support for multiple processing engines, adaptive streaming, and intelligent caching.

[![npm version](https://badge.fury.io/js/mes-engine.svg)](https://badge.fury.io/js/mes-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎥 **Multiple Video Engines**: FFmpeg and GStreamer support.
- 🔄 **Adaptive Streaming**: Automatic HLS (`.m3u8`) manifest generation with master and quality playlists.
- 📦 **Chunk-based Processing**: Parallelizable video chunking for efficient delivery.
- 📸 **Screenshot Extraction**: Automatic thumbnail generation for every video chunk.
- 💾 **Flexible Storage**: Abstract storage layer supporting local filesystem and easily extensible to S3/Cloud storage.
- 🚀 **Intelligent Caching**: Built-in strategies for preloading and caching video segments.
- 📡 **Event-driven**: Comprehensive event system for monitoring processing progress.

## Quick Start

### Installation

```bash
npm install mes-engine
```

### Basic Usage

```typescript
import {
  VideoProcessor,
  FFmpegEngine,
  FileSystemStorage
} from 'mes-engine';

// 1. Initialize Storage and Engine
const storage = new FileSystemStorage();
const engine = new FFmpegEngine();

// 2. Setup Configuration
const config = {
  chunkSize: 10, // seconds
  cacheDir: './output',
  maxCacheSize: 1024 * 1024 * 1024, // 1GB
  defaultQualities: [
    { height: 720, bitrate: '2500k' },
    { height: 1080, bitrate: '5000k' }
  ]
};

// 3. Initialize Processor
const processor = new VideoProcessor(engine, storage, config);

// 4. Listen for Progress
processor.on('chunk_processed', (event) => {
  console.log(`Processed ${event.quality.height}p chunk ${event.chunkNumber}`);
});

// 5. Process Video
const manifest = await processor.processVideo('input.mp4', {
  title: 'My Awesome Video',
  overallDescription: 'A high-quality adaptive stream.'
});

console.log('Master Playlist:', manifest.hls?.masterPlaylist);
```

### Examples
- **[Simple Usage](./examples/simple-usage)**: Minimal setup to get started quickly.
- **[Full Demo](./examples/full-demo)**: A complete React + Node.js application.

## Documentation

Full documentation is available in the [docs directory](./docs).

### Key Topics:
- [Getting Started](./docs/getting-started.md)
- [Adaptive Streaming (HLS)](./docs/HLS.md)
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