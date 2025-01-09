// core/VideoEngine.ts
import { EventEmitter } from 'events';
import { VideoConfig, QualityLevel, VideoManifest } from './types';
import { VideoEvent } from './events';

export abstract class VideoEngine extends EventEmitter {
    abstract processChunk(
        inputPath: string,
        outputPath: string,
        startTime: number,
        quality: QualityLevel
    ): Promise<void>;

    abstract getDuration(inputPath: string): Promise<number>;
}