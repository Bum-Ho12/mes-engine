// src/core/VideoEngine.ts
import { EventEmitter } from 'events';
import { QualityLevel } from './types';

export abstract class VideoEngine extends EventEmitter {
    abstract processChunk(
        inputPath: string,
        outputPath: string,
        startTime: number,
        quality: QualityLevel
    ): Promise<void>;

    abstract getDuration(inputPath: string): Promise<number>;
}