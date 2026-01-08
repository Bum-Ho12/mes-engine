// src/core/events.ts
export enum VideoEvent {
    CHUNK_PROCESSED = 'chunkProcessed',
    QUALITY_PROCESSED = 'qualityProcessed',
    PROCESSING_COMPLETE = 'processingComplete',
    ERROR = 'error'
}
