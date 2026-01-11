import {
    VideoProcessor,
    FFmpegEngine,
    FileSystemStorage,
    InternalCache
} from 'mes-engine';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class VideoProcessorService {
    constructor() {
        this.processor = new VideoProcessor(
            new FFmpegEngine(),
            new FileSystemStorage(path.join(__dirname, '../../processed')),
            {
                chunkSize: 10, // 10 seconds
                cacheDir: path.join(__dirname, '../../processed'),
                maxCacheSize: parseInt(process.env.CACHE_SIZE) || 100 * 1024 * 1024, // 100MB
                defaultQualities: [
                    { height: 1080, bitrate: '5000k' },
                    { height: 720, bitrate: '2500k' },
                    { height: 480, bitrate: '1000k' },
                    { height: 360, bitrate: '500k' }
                ]
            }
        );

        this.setupEventListeners();
    }

    setupEventListeners() {
        // The current VideoProcessor doesn't emit 'progress',
        // it emits CHUNK_PROCESSED, QUALITY_PROCESSED, etc.
        this.processor.on('chunkProcessed', (data) => {
            console.log('Chunk processed:', data);
        });

        this.processor.on('processingComplete', (data) => {
            console.log('Processing complete:', data);
        });

        this.processor.on('error', (error) => {
            console.error('Processing error:', error);
        });
    }

    async processVideo(filePath, socketId, io) {
        try {
            // Emit processing started
            io.to(socketId).emit('processing:started', { filePath });

            // Process video
            // Note: VideoProcessor.processVideo(inputPath, options)
            const manifest = await this.processor.processVideo(filePath, {
                title: path.basename(filePath)
            });

            // Emit processing complete
            io.to(socketId).emit('processing:complete', { manifest });

            return manifest;
        } catch (error) {
            io.to(socketId).emit('processing:error', { error: error.message });
            throw error;
        }
    }

    async streamChunk(videoId, quality, chunkNumber) {
        return await this.processor.streamChunk(videoId, quality, chunkNumber);
    }

    async getManifest(videoId) {
        // In actual implementation, we'd read from disk or memory.
        // For the demo, let's assume we can fetch it.
        // The VideoProcessor doesn't have a getManifest method.
        const manifestPath = path.join(__dirname, '../../processed', videoId, 'manifest.json');
        const data = await fs.promises.readFile(manifestPath, 'utf8');
        return JSON.parse(data);
    }
}

import fs from 'fs';
export default new VideoProcessorService();
