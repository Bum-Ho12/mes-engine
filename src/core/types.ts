// src/core/types.ts

export interface VideoConfig {
    chunkSize: number;
    cacheDir: string;
    maxCacheSize: number;
    defaultQualities: QualityLevel[];
}

export interface QualityLevel {
    height: number;
    bitrate: string;
}

export interface ProcessingOptions {
    title?: string;
    overallDescription?: string;
    descriptions?: Record<number, string>;
}

export interface VideoChunk {
    quality: number;
    number: number;
    path: string;
    screenshotPath?: string;
    description?: string;
}

export interface VideoManifest {
    videoId: string;
    qualities: QualityLevel[];
    chunks: VideoChunk[];
    metadata: {
        title?: string;
        description?: string;
        createdAt: string;
    };
}
