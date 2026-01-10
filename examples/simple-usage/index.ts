import {
    VideoProcessor,
    FFmpegEngine,
    FileSystemStorage,
    VideoManifest
} from '../../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup basic paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSimpleDemo() {
    console.log('--- MES Engine Simple Demo ---');

    // 1. Initialize the storage provider
    // This is where processed chunks and manifests will be saved.
    // In this version, FileSystemStorage doesn't take constructor arguments.
    const storage = new FileSystemStorage();

    // 2. Initialize the video engine
    const engine = new FFmpegEngine();

    // 3. Initialize the VideoProcessor
    // The VideoProcessor requires: engine, storage, and a VideoConfig object.
    const processor = new VideoProcessor(
        engine,
        storage,
        {
            chunkSize: 10, // 10 second chunks
            cacheDir: path.join(__dirname, 'output'),
            maxCacheSize: 1024 * 1024 * 1024, // 1GB
            defaultQualities: [
                { height: 720, bitrate: '2500k' },
                { height: 1080, bitrate: '5000k' }
            ]
        }
    );

    // 4. Set up event listeners for progress
    // Note: The actual events are defined in src/core/events.ts
    processor.on('chunk_processed', (event) => {
        console.log(`Chunk ${event.chunkNumber} completed at quality ${event.quality.height}p`);
    });

    // 5. Start processing a video
    const inputPath = path.join(__dirname, 'input.mp4');

    console.log(`Starting processing for: ${inputPath}`);

    try {
        // The actual method is processVideo, not process
        const manifest: VideoManifest = await processor.processVideo(inputPath, {
            title: 'Demo Video',
            overallDescription: 'A simple demonstration of mes-engine'
        });

        console.log('Processing completed successfully!');
        console.log('Manifest:', JSON.stringify(manifest, null, 2));
        // Note: VideoManifest from src/core/types.ts doesn't have an 'hls' property yet
        // based on the current file content.
    } catch (error) {
        console.error('Processing failed:', error);
    }
}

runSimpleDemo().catch(console.error);
