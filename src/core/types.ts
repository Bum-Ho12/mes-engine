// src/core/types.ts

/** Configuration for video processing engine */
export interface VideoConfig {
    /** Size of each video chunk in seconds */
    chunkSize: number;
    /** Directory for temporary cache files */
    cacheDir: string;
    /** Maximum cache size in bytes */
    maxCacheSize: number;
    /** Default quality levels for processing */
    defaultQualities: QualityLevel[];
}

/** Definition of a video quality level */
export interface QualityLevel {
    /** Vertical resolution (e.g., 720, 1080) */
    height: number;
    /** Target bitrate (e.g., "2500k") */
    bitrate: string;
}

/** Options for a specific processing job */
export interface ProcessingOptions {
    /** Title of the video */
    title?: string;
    /** Overall description of the video content */
    overallDescription?: string;
    /** Descriptions for individual chunks indexed by chunk number */
    descriptions?: Record<number, string>;
}

/** Represents a processed video chunk */
export interface VideoChunk {
    /** Height of the quality level */
    quality: number;
    /** Sequential index of the chunk */
    number: number;
    /** Local path to the processed file */
    path: string;
    /** Optional path to a screenshot for this chunk */
    screenshotPath?: string;
    /** Optional localized description */
    description?: string;
}

/** Full manifest for a processed video */
export interface VideoManifest {
    /** Unique identifier for the video */
    videoId: string;
    /** Available quality levels */
    qualities: QualityLevel[];
    /** List of all processed chunks */
    chunks: VideoChunk[];
    /** Core metadata */
    metadata: {
        title?: string;
        description?: string;
        createdAt: string;
    };
}
