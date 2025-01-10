
// core/types.ts

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

export interface VideoChunk {
    quality: number;
    number: number;
    path: string;
}

export interface VideoManifest {
    videoId: string;
    qualities: QualityLevel[];
    chunks: VideoChunk[];
}