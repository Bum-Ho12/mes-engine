// src/core/VideoEngine.ts
import { EventEmitter } from 'events';
import { QualityLevel } from './types.js';

/**
 * Base class for video processing engines (e.g., FFmpeg, GStreamer).
 */
export abstract class VideoEngine extends EventEmitter {
    /**
     * Extracts and transcodes a chunk of video.
     * @param inputPath - Path to source video
     * @param outputPath - Destination for the chunk
     * @param startTime - Start offset in seconds
     * @param quality - Target quality level
     */
    abstract processChunk(
        inputPath: string,
        outputPath: string,
        startTime: number,
        quality: QualityLevel
    ): Promise<void>;

    /**
     * Extracts a frame from the video as an image.
     * @param inputPath - Path to source video
     * @param outputPath - Destination for the image
     * @param time - Time offset in seconds
     */
    abstract extractScreenshot(
        inputPath: string,
        outputPath: string,
        time: number
    ): Promise<void>;

    /**
     * Gets the total duration of the video.
     * @param inputPath - Path to source video
     * @returns Promise resolving to duration in seconds
     */
    abstract getDuration(inputPath: string): Promise<number>;
}