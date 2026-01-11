# API Reference

Detailed documentation of the core classes and interfaces in `mes-engine`.

## Table of Contents
1. [VideoProcessor](#videoprocessor)
2. [VideoConfig](#videoconfig)
3. [ProcessingOptions](#processingoptions)
4. [VideoManifest](#videomanifest)
5. [Engines](#engines)
6. [Storage](#storage)

---

## VideoProcessor

The main class responsible for coordinating video processing and streaming.

### Constructor
`new VideoProcessor(engine: VideoEngine, storage: StorageProvider, config: VideoConfig)`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `engine` | `VideoEngine` | The video processing engine (e.g., `FFmpegEngine`). |
| `storage` | `StorageProvider` | The storage implementation (e.g., `FileSystemStorage`). |
| `config` | `VideoConfig` | Framework configuration object. |

### Methods

#### `processVideo(inputPath: string, options?: ProcessingOptions): Promise<VideoManifest>`
Processes a video file according to the configuration.
- **inputPath**: Absolute path to the source video.
- **options**: Optional metadata and description overrides.
- **Returns**: A promise that resolves to a `VideoManifest`.

#### `streamChunk(videoId: string, quality: number, chunkNumber: number, range?: { start: number; end: number }): Promise<Readable>`
Retrieves a readable stream for a specific video chunk.
- **videoId**: The unique ID generated during processing.
- **quality**: The vertical resolution (e.g., 720).
- **chunkNumber**: The 0-indexed segment number.
- **range**: Optional byte range for partial delivery.

---

## VideoConfig

Configuration object for the `VideoProcessor`.

| Property | Type | Description |
| :--- | :--- | :--- |
| `chunkSize` | `number` | Duration of each video segment in seconds. |
| `cacheDir` | `string` | Local directory for storing processed files. |
| `maxCacheSize` | `number` | Maximum size of the cache in bytes. |
| `defaultQualities` | `QualityLevel[]` | Array of quality targets (height and bitrate). |

### QualityLevel
```typescript
interface QualityLevel {
    height: number;
    bitrate: string; // e.g., '2500k'
}
```

---

## ProcessingOptions

Options passed to the `processVideo` method.

| Property | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Optional title for the video manifest. |
| `overallDescription` | `string` | Optional description for the video. |
| `descriptions` | `Record<number, string>` | Map of chunk indices to specific descriptions. |

---

## VideoManifest

The output of a processing job.

| Property | Type | Description |
| :--- | :--- | :--- |
| `videoId` | `string` | Generated unique identifier. |
| `qualities` | `QualityLevel[]`| Available quality levels. |
| `chunks` | `VideoChunk[]` | List of all processed segments. |
| `metadata` | `object` | Title, description, and creation date. |
| `hls` | `object` | (New) Contains `masterPlaylist` path. |

---

## Engines

### `FFmpegEngine`
A wrapper around FFmpeg for transcoding.
- Requires `ffmpeg` to be installed on the system.

### `GStreamerEngine`
A high-performance alternative using GStreamer.

---

## Storage

### `FileSystemStorage`
Standard storage provider for saving files to the local disk.

### `StorageProvider` (Abstract)
Base class for creating custom storage providers (e.g., S3, Azure Blob).
