import { expect } from 'chai';
import { VideoProcessor } from '../src/processor';
import { FFmpegEngine } from '../src/engines/FFmpegEngine';
import { FileSystemStorage } from '../src/storage/FileSystemStorage';
import { VideoConfig, QualityLevel } from '../src/core/types';
import { StorageProvider } from '../src/storage/StorageProvider';
import { VideoEngine } from '../src/core/VideoEngine';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { Readable } from 'stream';
import { VideoEvent } from '../src/core/events';

// Mock implementation of a custom engine to test modularity
class CustomVideoEngine extends VideoEngine {
    private storage: StorageProvider;

    constructor(storage: StorageProvider) {
        super();
        this.storage = storage;
    }

    async processChunk(
        inputPath: string,
        outputPath: string,
        startTime: number,
        quality: QualityLevel
    ): Promise<void> {
        // Create the directory path for the chunk if it doesn't exist
        await fs.mkdir(dirname(outputPath), { recursive: true });

        const chunkData = Buffer.from('test'); // Mock chunk data

        // Mock implementation - write to file system
        await fs.writeFile(outputPath, chunkData);

        // Also save to the shared storage provider
        await this.storage.saveChunk(outputPath, chunkData);
    }

    async getDuration(inputPath: string): Promise<number> {
        return 30; // Mock duration
    }

    async extractScreenshot(
        inputPath: string,
        outputPath: string,
        time: number
    ): Promise<void> {
        // Create the directory path for the screenshot if it doesn't exist
        await fs.mkdir(dirname(outputPath), { recursive: true });
        // Mock implementation - write an empty file to simulate screenshot
        await fs.writeFile(outputPath, Buffer.from('mock-screenshot'));
    }
}

// Mock implementation of a custom storage provider
class CustomStorageProvider extends StorageProvider {
    private static storage = new Map<string, Buffer>();

    async saveChunk(chunkPath: string, data: Buffer): Promise<void> {
        console.log(`Saving chunk at: ${chunkPath}`);
        CustomStorageProvider.storage.set(chunkPath, data);
    }

    async getChunk(chunkPath: string): Promise<Buffer> {
        console.log(`Fetching chunk at: ${chunkPath}`);
        const data = CustomStorageProvider.storage.get(chunkPath);
        if (!data) throw new Error('Chunk not found');
        return data;
    }

    async deleteChunk(chunkPath: string): Promise<void> {
        CustomStorageProvider.storage.delete(chunkPath);
    }

    // Add a public method to clear the storage
    public clearStorage(): void {
        CustomStorageProvider.storage.clear();
    }
}

const globalStorage = new CustomStorageProvider();

beforeEach(() => {
    // Optional: Reset storage if needed
    globalStorage.clearStorage();
});

describe('Video Processing Framework', () => {
    const testConfig: VideoConfig = {
        chunkSize: 10,
        cacheDir: './test-cache',
        maxCacheSize: 1024 * 1024 * 100, // 100MB
        defaultQualities: [
            { height: 720, bitrate: '2000k' },
            { height: 480, bitrate: '1000k' }
        ]
    };

    beforeEach(async () => {
        // Create test cache directory
        await fs.mkdir(testConfig.cacheDir, { recursive: true });
        // Create a mock test video file so fs.stat() works in generateVideoId
        await fs.writeFile('test-video.mp4', Buffer.from('mock-video-data'));
    });

    afterEach(async () => {
        // Cleanup test cache directory
        await fs.rm(testConfig.cacheDir, { recursive: true, force: true });
        // Cleanup mock test video file
        await fs.rm('test-video.mp4', { force: true });
    });

    describe('Modular Engine System', () => {
        it('should work with FFmpegEngine', async () => {
            const engine = new FFmpegEngine();
            const storage = new FileSystemStorage();
            const processor = new VideoProcessor(engine, storage, testConfig);
            expect(processor).to.be.instanceOf(VideoProcessor);
        });

        it('should work with CustomVideoEngine', async () => {
            const storage = new FileSystemStorage();
            const engine = new CustomVideoEngine(storage);
            const processor = new VideoProcessor(engine, storage, testConfig);
            expect(processor).to.be.instanceOf(VideoProcessor);
        });
    });

    describe('Abstract Storage Providers', () => {
        it('should work with FileSystemStorage', async () => {
            const storage = new FileSystemStorage();
            const engine = new CustomVideoEngine(storage);
            const processor = new VideoProcessor(engine, storage, testConfig);
            expect(processor).to.be.instanceOf(VideoProcessor);
        });

        it('should work with CustomStorageProvider', async () => {
            const storage = new CustomStorageProvider();
            const engine = new CustomVideoEngine(storage);
            const processor = new VideoProcessor(engine, storage, testConfig);
            expect(processor).to.be.instanceOf(VideoProcessor);
        });
    });

    describe('Stream Management', () => {
        it('should create readable stream for chunk', async () => {
            const storage = new CustomStorageProvider();
            const engine = new CustomVideoEngine(storage);
            const processor = new VideoProcessor(engine, storage, testConfig);

            // Mock a video file for testing
            const videoId = 'test-video_12345';
            const quality = 720;
            const chunkNumber = 0;
            const chunkData = Buffer.from('test');

            // Simulate chunk processing and saving
            const chunkPath = join(
                testConfig.cacheDir,
                videoId,
                `${quality}p`,
                `chunk_${chunkNumber}.mp4`
            );
            await storage.saveChunk(chunkPath, chunkData);

            // Process a test video first
            const manifest = await processor.processVideo('test-video.mp4');
            console.log('Manifest:', manifest); // Debugging

            expect(manifest.chunks).to.have.length.greaterThan(0); // Ensure chunks exist

            // Test streaming a chunk
            const stream = await processor.streamChunk(
                manifest.videoId,
                720,
                0
            );

            // Verify the stream is a readable stream
            expect(stream).to.be.instanceOf(Readable);

            // Read from the stream to validate its content
            const data = await new Promise<Buffer>((resolve, reject) => {
                const chunks: Buffer[] = [];
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('end', () => resolve(Buffer.concat(chunks)));
                stream.on('error', reject);
            });

            expect(data.toString()).to.equal(chunkData.toString());

            expect(stream).to.be.instanceOf(Readable);
        });

        it('should support range requests', async () => {
            const storage = new CustomStorageProvider();
            const engine = new CustomVideoEngine(storage);
            const processor = new VideoProcessor(engine, storage, testConfig);

            const manifest = await processor.processVideo('test-video.mp4');
            const stream = await processor.streamChunk(
                manifest.videoId,
                720,
                0,
                { start: 0, end: 100 }
            );
            expect(stream).to.be.instanceOf(Readable);
        });
    });

    describe('Event System', () => {
        it('should emit events during processing', async () => {
            const storage = new CustomStorageProvider();
            const engine = new CustomVideoEngine(storage);
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

    describe('Configurable Quality Levels', () => {
        it('should process video in configured quality levels', async () => {
            const storage = new CustomStorageProvider();
            const engine = new CustomVideoEngine(storage);
            const processor = new VideoProcessor(engine, storage, testConfig);

            const manifest = await processor.processVideo('test-video.mp4');

            expect(manifest.qualities).to.deep.equal(testConfig.defaultQualities);
            expect(manifest.chunks).to.have.length.greaterThan(0);

            // Verify chunks exist for each quality
            const qualities = new Set(manifest.chunks.map(chunk => chunk.quality));
            expect(qualities.size).to.equal(testConfig.defaultQualities.length);
        });
    });

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
});