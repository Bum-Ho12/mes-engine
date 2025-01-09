// VideoProcessor.ts
import { VideoEngine } from './core/VideoEngine';
import { EventEmitter } from 'events';
import { StorageProvider } from './storage/StorageProvider';
import { StreamManager } from './streaming/StreamManager';
import { VideoConfig, VideoManifest } from './core/types';
import { join } from 'path';
import { promises as fs } from 'fs';
import { Readable } from 'stream';
import { VideoEvent } from './core/events';

export class VideoProcessor extends EventEmitter {
    private engine: VideoEngine;
    private storage: StorageProvider;
    private streamManager: StreamManager;
    private config: VideoConfig;

    constructor(
        engine: VideoEngine,
        storage: StorageProvider,
        config: VideoConfig
    ) {
        super();
        this.engine = engine;
        this.storage = storage;
        this.streamManager = new StreamManager(storage);
        this.config = config;
    }

    async processVideo(inputPath: string): Promise<VideoManifest> {
        const videoId = await this.generateVideoId(inputPath);
        const manifest: VideoManifest = {
        videoId,
        qualities: this.config.defaultQualities,
        chunks: []
        };

        const duration = await this.engine.getDuration(inputPath);
        const chunks = Math.ceil(duration / this.config.chunkSize);

        for (const quality of this.config.defaultQualities) {
        for (let i = 0; i < chunks; i++) {
            const chunkPath = this.getChunkPath(videoId, quality.height, i);

            try {
            await this.engine.processChunk(
                inputPath,
                chunkPath,
                i * this.config.chunkSize,
                quality
            );

            manifest.chunks.push({
                quality: quality.height,
                number: i,
                path: chunkPath
            });

            this.emit(VideoEvent.CHUNK_PROCESSED, { quality, chunkNumber: i });
            } catch (error) {
            this.emit(VideoEvent.ERROR, error);
            throw error;
            }
        }

        this.emit(VideoEvent.QUALITY_PROCESSED, quality);
        }

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

    private async generateVideoId(inputPath: string): Promise<string> {
        const stats = await fs.stat(inputPath);
        return `${inputPath.split('/').pop()?.split('.')[0]}_${stats.mtimeMs}`;
    }
}