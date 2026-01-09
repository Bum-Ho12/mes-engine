import { VideoProcessor } from '../src/processor';
import { FFmpegEngine } from '../src/engines/FFmpegEngine';
import { FileSystemStorage } from '../src/storage/FileSystemStorage';
import { VideoConfig } from '../src/core/types';
import { join } from 'path';

/**
 * Basic usage example of mes-engine with HLS and Metadata support.
 */
async function runDemo() {
    // 1. Setup configuration
    const config: VideoConfig = {
        chunkSize: 5,           // 5-second chunks
        cacheDir: './demo-output',
        maxCacheSize: 1024 * 1024 * 500, // 500MB
        defaultQualities: [
            { height: 720, bitrate: '2500k' },
            { height: 480, bitrate: '1000k' }
        ]
    };

    // 2. Initialize engine, storage, and processor
    const engine = new FFmpegEngine();
    const storage = new FileSystemStorage();
    const processor = new VideoProcessor(engine, storage, config);

    // 3. Define input video path (Make sure this file exists)
    const inputPath = 'video.mp4';

    console.log('--- Starting Video Processing ---');
    console.log(`Input: ${inputPath}`);

    try {
        // 4. Process video with metadata and descriptions
        const manifest = await processor.processVideo(inputPath, {
            title: 'Professional Demo Video',
            overallDescription: 'A demonstration of adaptive bitrate streaming with mes-engine.',
            descriptions: [
                'Introduction and Hook',
                'Core Features Review',
                'Deep Dive into Technology',
                'Performance Benchmarks',
                'Conclusion and Call to Action'
            ]
        });

        // 5. Output results
        console.log('\n--- Processing Complete ---');
        console.log(`Video ID: ${manifest.videoId}`);
        console.log(`Manifest saved to: ${join(config.cacheDir, manifest.videoId, 'manifest.json')}`);
        console.log(`HLS Master Playlist: ${join(config.cacheDir, manifest.videoId, 'master.m3u8')}`);

        console.log('\nChunk 0 Metadata:');
        console.log(` - Quality: ${manifest.chunks[0].quality}p`);
        console.log(` - Screenshot: ${manifest.chunks[0].screenshotPath}`);
        console.log(` - Description: ${manifest.chunks[0].description}`);

    } catch (error) {
        console.error('Error during processing:', error);
        console.log('\nNOTE: Make sure you have ffmpeg installed and a valid "video.mp4" file in the root directory.');
    }
}

runDemo();
