// cache/InternalCache.ts
import { LRU } from './LRU';
import { CacheStrategy, CacheOptions } from './cacheStrategy';
import { StorageProvider } from '../storage/StorageProvider';

export class InternalCache extends CacheStrategy {
    private cache: LRU<Buffer>;
    private options: CacheOptions;
    private storage: StorageProvider;

    constructor(options: CacheOptions, storage: StorageProvider) {
        super();
        this.options = options;
        this.cache = new LRU(options.maxSize);
        this.storage = storage;
    }

    async set(key: string, value: Buffer): Promise<void> {
        this.cache.set(key, value);
    }

    async get(key: string): Promise<Buffer | null> {
        const cached = this.cache.get(key);
        if (cached) return cached;

        try {
        const data = await this.storage.getChunk(key);
        await this.set(key, data);
        return data;
        } catch {
        return null;
        }
    }

    async preload(key: string): Promise<void> {
        if (this.options.preloadNextChunk) {
        const nextChunkKey = this.getNextChunkKey(key);
        if (!this.cache.get(nextChunkKey)) {
            try {
            const data = await this.storage.getChunk(nextChunkKey);
            await this.set(nextChunkKey, data);
            } catch {
            // Ignore preload failures
            }
        }
        }
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }

    private getNextChunkKey(currentKey: string): string {
        const parts = currentKey.split('_');
        const currentChunk = parseInt(parts[parts.length - 1]);
        parts[parts.length - 1] = (currentChunk + 1).toString();
        return parts.join('_');
    }
}