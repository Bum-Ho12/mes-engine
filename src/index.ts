// index.ts
export * from './core/types';
export * from './core/events';
export * from './core/VideoEngine';
export * from './engines/FFmpegEngine';
export * from './storage/StorageProvider';
export * from './storage/FileSystemStorage';
export * from './cache/cacheStrategy';
export * from './cache/internalCache';
export * from './cache/ExternalCache';
export * from './processor';

// // Example usage
// import { FFmpegEngine } from './engines/FFmpegEngine';
// import { FileSystemStorage } from './storage/FileSystemStorage';

// const config: VideoConfig = {
//   chunkSize: 10,
//   cacheDir: './video_cache',
//   maxCacheSize: 1000,
//   defaultQualities: [
//     { height: 1080, bitrate: '4M' },
//     { height: 720, bitrate: '2M' },
//     { height: 480, bitrate: '1M' }
//   ]
// };

// const processor = new VideoProcessor(
//   new FFmpegEngine(),
//   new FileSystemStorage(),
//   config
// );

// // Event handling
// processor.on(VideoEvent.CHUNK_PROCESSED, ({ quality, chunkNumber }) => {
//   console.log(`Processed chunk ${chunkNumber} for ${quality.height}p`);
// });

// // Process video
// const manifest = await processor.processVideo('input.mp4');

// // Stream chunk
// const stream = await processor.streamChunk(manifest.videoId, 1080, 0);
// stream.pipe(process.stdout);
