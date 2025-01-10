
# Video Processing Framework

## Installation
```bash
npm install mes-engine
```

> **Note**: If you plan to use other engines besides `FFmpegEngine`, you may need to install them separately.

For example, to install the `FFmpeg` engine:
```bash
npm install ffmpeg-static
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
See [docs/](./docs) for detailed documentation. Also, good documentation for the usage and meaning of each component is welcomed.

## Engines Support
Currently, the following video engines are available:
- **FFmpegEngine**: Uses `ffmpeg` for video processing. You need to install `ffmpeg-static` or another FFmpeg binary to use this engine.
- **Custom Engines**: You can implement your own engine by extending the `VideoEngine` class.

For more details on engine implementation, see the [Engines](./docs/engines.md) page.

## Test Cases

### Modular Engine System
```typescript
describe('Modular Engine System', () => {
  it('should work with FFmpegEngine', async () => {
    const engine = new FFmpegEngine();
    const storage = new FileSystemStorage();
    const processor = new VideoProcessor(engine, storage, testConfig);
    expect(processor).to.be.instanceOf(VideoProcessor);
  });

  it('should work with CustomVideoEngine', async () => {
    const engine = new CustomVideoEngine();
    const storage = new FileSystemStorage();
    const processor = new VideoProcessor(engine, storage, testConfig);
    expect(processor).to.be.instanceOf(VideoProcessor);
  });
});
```

### Abstract Storage Providers
```typescript
describe('Abstract Storage Providers', () => {
  it('should work with FileSystemStorage', async () => {
    const engine = new CustomVideoEngine();
    const storage = new FileSystemStorage();
    const processor = new VideoProcessor(engine, storage, testConfig);
    expect(processor).to.be.instanceOf(VideoProcessor);
  });

  it('should work with CustomStorageProvider', async () => {
    const engine = new CustomVideoEngine();
    const storage = new CustomStorageProvider();
    const processor = new VideoProcessor(engine, storage, testConfig);
    expect(processor).to.be.instanceOf(VideoProcessor);
  });
});
```

### Stream Management
```typescript
describe('Stream Management', () => {
  it('should create readable stream for chunk', async () => {
    const engine = new CustomVideoEngine();
    const storage = new CustomStorageProvider();
    const processor = new VideoProcessor(engine, storage, testConfig);
    const chunkPath = join(testConfig.cacheDir, videoId, `${quality}p`, `chunk_${chunkNumber}.mp4`);
    await storage.saveChunk(chunkPath, chunkData);
    const manifest = await processor.processVideo('test-video.mp4');
    const stream = await processor.streamChunk(manifest.videoId, 720, 0);
    expect(stream).to.be.instanceOf(Readable);
    const data = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
    expect(data.toString()).to.equal(chunkData.toString());
    expect(stream).to.be.instanceOf(Readable);
  });
});
```

### Event System
```typescript
describe('Event System', () => {
  it('should emit events during processing', async () => {
    const engine = new CustomVideoEngine();
    const storage = new CustomStorageProvider();
    const processor = new VideoProcessor(engine, storage, testConfig);
    const events: string[] = [];
    processor.on(VideoEvent.CHUNK_PROCESSED, () => events.push('chunk'));
    processor.on(VideoEvent.QUALITY_PROCESSED, () => events.push('quality'));
    processor.on(VideoEvent.PROCESSING_COMPLETE, () => events.push('complete'));
    await processor.processVideo('test-video.mp4');
    expect(events).to.include('chunk');
    expect(events).to.include('quality');
    expect(events).to.include('complete');
  });
});
```

### Configurable Quality Levels
```typescript
describe('Configurable Quality Levels', () => {
  it('should process video in configured quality levels', async () => {
    const engine = new CustomVideoEngine();
    const storage = new CustomStorageProvider();
    const processor = new VideoProcessor(engine, storage, testConfig);
    const manifest = await processor.processVideo('test-video.mp4');
    expect(manifest.qualities).to.deep.equal(testConfig.defaultQualities);
    expect(manifest.chunks).to.have.length.greaterThan(0);
    const qualities = new Set(manifest.chunks.map(chunk => chunk.quality));
    expect(qualities.size).to.equal(testConfig.defaultQualities.length);
  });
});
```

### TypeScript Interfaces
```typescript
describe('TypeScript Interfaces', () => {
  it('should validate type safety of configuration', () => {
    const config: VideoConfig = {
      chunkSize: 10,
      cacheDir: './test-cache',
      maxCacheSize: 1024 * 1024 * 100,
      defaultQualities: [
        { height: 720, bitrate: '2000k' }
      ]
    };
    expect(config).to.have.all.keys([
      'chunkSize',
      'cacheDir',
      'maxCacheSize',
      'defaultQualities'
    ]);
  });
});
```

