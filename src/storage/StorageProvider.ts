// src/storage/StorageProvider.ts
/**
 * Interface for storage backends (e.g., Local File System, S3, Cloud Storage).
 */
export abstract class StorageProvider {
    /** Saves a video chunk to storage */
    abstract saveChunk(chunkPath: string, data: Buffer): Promise<void>;
    /** Retrieves a video chunk from storage */
    abstract getChunk(chunkPath: string): Promise<Buffer>;
    /** Deletes a video chunk from storage */
    abstract deleteChunk(chunkPath: string): Promise<void>;
}