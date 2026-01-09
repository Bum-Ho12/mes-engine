// src/processor.ts
import { VideoEngine } from './core/VideoEngine.js';
import { EventEmitter } from 'events';
import { StorageProvider } from './storage/StorageProvider.js';
import { StreamManager } from './streaming/StreamManager.js';
import { VideoConfig, VideoManifest, VideoChunk, ProcessingOptions } from './core/types.js';
import { join } from 'path';
import { promises as fs } from 'fs';
import { Readable } from 'stream';
import { VideoEvent } from './core/events.js';

export class VideoProcessor extends EventEmitter {
    private engine: VideoEngine;
    private streamManager: StreamManager;
    private config: VideoConfig;

    constructor(
        engine: VideoEngine,
        storage: StorageProvider,
        config: VideoConfig
    ) {
        super();
        this.engine = engine;
        this.streamManager = new StreamManager(storage);
        this.config = config;
    }

    async processVideo(
        inputPath: string,
        options?: ProcessingOptions
    ): Promise<VideoManifest> {
        const videoId = await this.generateVideoId(inputPath);
        const manifest: VideoManifest = {
            videoId,
            qualities: this.config.defaultQualities,
            chunks: [],
            metadata: {
                title: options?.title,
                description: options?.overallDescription,
                createdAt: new Date().toISOString()
            }
        };

        const duration = await this.engine.getDuration(inputPath);
        const chunks = Math.ceil(duration / this.config.chunkSize);

        for (const quality of this.config.defaultQualities) {
            let m3u8Content = '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:' + this.config.chunkSize + '\n#EXT-X-MEDIA-SEQUENCE:0\n#EXT-X-PLAYLIST-TYPE:VOD\n';

            for (let i = 0; i < chunks; i++) {
                const chunkPath = this.getChunkPath(videoId, quality.height, i);
                const screenshotPath = this.getScreenshotPath(videoId, i);

                try {
                    // Process chunk
                    await this.engine.processChunk(
                        inputPath,
                        chunkPath,
                        i * this.config.chunkSize,
                        quality
                    );

                    // Extract screenshot (only once per chunk number, e.g., for the first quality)
                    if (quality.height === this.config.defaultQualities[0].height) {
                        await this.engine.extractScreenshot(
                            inputPath,
                            screenshotPath,
                            i * this.config.chunkSize + 1 // 1 second into the chunk
                        );
                    }

                    const chunk: VideoChunk = {
                        quality: quality.height,
                        number: i,
                        path: chunkPath,
                        screenshotPath: screenshotPath,
                        description: options?.descriptions?.[i]
                    };

                    manifest.chunks.push(chunk);

                    // Add to M3U8
                    m3u8Content += `#EXTINF:${this.config.chunkSize}.0,\nchunk_${i}.mp4\n`;

                    this.emit(VideoEvent.CHUNK_PROCESSED, { quality, chunkNumber: i });
                } catch (error) {
                    this.emit(VideoEvent.ERROR, error);
                    throw error;
                }
            }
            m3u8Content += '#EXT-X-ENDLIST';

            // Save M3U8 for this quality
            const m3u8Path = join(this.config.cacheDir, videoId, `${quality.height}p`, 'playlist.m3u8');
            await fs.writeFile(m3u8Path, m3u8Content);

            this.emit(VideoEvent.QUALITY_PROCESSED, quality);
        }

        // Generate Master M3U8
        if (this.config.defaultQualities.length > 1) {
            let masterM3u8 = '#EXTM3U\n';
            for (const quality of this.config.defaultQualities) {
                masterM3u8 += `#EXT-X-STREAM-INF:BANDWIDTH=${quality.bitrate.replace('k', '000')},RESOLUTION=-1x${quality.height}\n${quality.height}p/playlist.m3u8\n`;
            }
            const masterPath = join(this.config.cacheDir, videoId, 'master.m3u8');
            await fs.writeFile(masterPath, masterM3u8);
        }

        // Save JSON Manifest
        const manifestPath = join(this.config.cacheDir, videoId, 'manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

        this.emit(VideoEvent.PROCESSING_COMPLETE, manifest);
        return manifest;
    }

    async streamChunk(
        videoId: string,
        quality: number,
        chunkNumber: number,
        range?: { start: number; end: number }
    ): Promise<Readable> {
        const chunkPath = this.getChunkPath(videoId, quality, chunkNumber);
        return this.streamManager.createStream(chunkPath, range);
    }

    private getChunkPath(videoId: string, quality: number, chunkNumber: number): string {
        return join(this.config.cacheDir, videoId, `${quality}p`, `chunk_${chunkNumber}.mp4`);
    }

    private getScreenshotPath(videoId: string, chunkNumber: number): string {
        return join(this.config.cacheDir, videoId, 'screenshots', `chunk_${chunkNumber}.jpg`);
    }

    private async generateVideoId(inputPath: string): Promise<string> {
        const stats = await fs.stat(inputPath);
        const fileName = inputPath.split(/[\\/]/).pop()?.split('.')[0];
        return `${fileName}_${Math.floor(stats.mtimeMs)}`;
    }
}
