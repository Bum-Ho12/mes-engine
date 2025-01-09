// storage/StorageProvider.ts
export abstract class StorageProvider {
    abstract saveChunk(chunkPath: string, data: Buffer): Promise<void>;
    abstract getChunk(chunkPath: string): Promise<Buffer>;
    abstract deleteChunk(chunkPath: string): Promise<void>;
}