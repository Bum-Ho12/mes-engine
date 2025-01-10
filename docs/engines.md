# Engines Support

## FFmpegEngine
The `FFmpegEngine` uses `ffmpeg` for video processing. You will need to install an FFmpeg binary to use this engine.

### Installation of FFmpeg
To use the `FFmpegEngine`, you must install FFmpeg or use `ffmpeg-static` to include the FFmpeg binary. You can install `ffmpeg-static` by running:

```bash
npm install ffmpeg-static
```

Alternatively, you can use any other FFmpeg binary that is compatible with your system.

### Example Usage:

```typescript
import { FFmpegEngine } from 'mes-engine';

// Create an FFmpeg engine instance
const engine = new FFmpegEngine();

// Use it to process video chunks
engine.processChunk('input.mp4', 'output.mp4', 0, { height: 720, bitrate: '2000k' })
  .then(() => {
    console.log('Chunk processed successfully');
  })
  .catch(error => {
    console.error('Error processing chunk:', error);
  });
```

## Custom Engines
You can implement your own video processing engine by extending the `VideoEngine` class. Here’s an example of how to create a custom engine:

### Example Custom Engine:

```typescript
import { VideoEngine } from 'mes-engine';

class CustomVideoEngine extends VideoEngine {
  async processChunk(inputPath: string, outputPath: string, startTime: number, quality: any): Promise<void> {
    // Implement custom video processing logic here
  }

  async getDuration(inputPath: string): Promise<number> {
    // Implement custom duration calculation logic here
    return 120; // Example
  }
}
```

For more details on implementing custom engines, see the [VideoEngine class](../src/core/VideoEngine.ts) in the codebase.

## Other Supported Engines
You can extend this framework with any other video processing engine that implements the `VideoEngine` interface.

For more details, check the [source code](https://github.com/Bum-Ho12/mes-engine) and adapt it as needed for your requirements.
