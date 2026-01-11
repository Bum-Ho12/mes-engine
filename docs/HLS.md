# HLS (HTTP Live Streaming) Support

`mes-engine` automatically generates HLS playlists and segments for adaptive bitrate streaming.

## How it works

When you process a video with `VideoProcessor.processVideo()`, the engine performs the following:

1.  **Multiple Quality Encodes**: The video is transcoded into each quality level specified in your `VideoConfig`.
2.  **Chunking**: Each quality version is split into MPEG-TS segments (or mp4 fragments depending on engine config).
3.  **Playlist Generation**:
    *   A `playlist.m3u8` is created for each individual quality (e.g., `720p/playlist.m3u8`).
    *   A `master.m3u8` is created at the root of the video directory, linking all quality levels.

## Configuration

HLS generation is currently driven by the `defaultQualities` in your `VideoConfig`.

```typescript
const config: VideoConfig = {
  chunkSize: 10,
  cacheDir: './output',
  maxCacheSize: 1024 * 1024 * 1024,
  defaultQualities: [
    { height: 1080, bitrate: '5000k' },
    { height: 720, bitrate: '2500k' }
  ]
};
```

## Accessing the Playlists

After processing, the `VideoManifest` returned by the processor contains the paths to the generated playlists.

```typescript
const manifest = await processor.processVideo('input.mp4');

// The storage provider handles the actual path construction.
// By default, they are saved in:
// [cacheDir]/[videoId]/master.m3u8
// [cacheDir]/[videoId]/[quality]p/playlist.m3u8
```

## Screenshots per Chunk

The engine also extracts a screenshot (typically at the 1-second mark) for every chunk. This is useful for building seekers or previews in your player.

The screenshot path is included in each `VideoChunk` object within the manifest:

```typescript
manifest.chunks.forEach(chunk => {
  console.log(`Chunk #${chunk.number} screenshot: ${chunk.screenshotPath}`);
});
```
