// src/core/events.ts
/**
 * Options:
 * 
 *  - CHUNK_PROCESSED
 *  - QUALITY_PROCESSED
 *  - PROCESSING_COMPLETE
 *  - ERROR
 */
export enum VideoEvent {
    CHUNK_PROCESSED = 'chunkProcessed',
    QUALITY_PROCESSED = 'qualityProcessed',
    PROCESSING_COMPLETE = 'processingComplete',
    ERROR = 'error'
}
