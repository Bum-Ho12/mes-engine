// src/core/VideoEngine.ts
import { EventEmitter } from 'events';
import { QualityLevel } from './types.js';

export abstract class VideoEngine extends EventEmitter {
    abstract processChunk(
        inputPath: string,
        outputPath: string,
        startTime: number,
        quality: QualityLevel
    ): Promise<void>;

    abstract extractScreenshot(
        inputPath: string,
        outputPath: string,
        time: number
    ): Promise<void>;

    abstract getDuration(inputPath: string): Promise<number>;
}