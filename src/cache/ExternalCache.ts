// cache/ExternalCache.ts
import fetch from 'node-fetch';
import { CacheStrategy, CacheOptions } from './cacheStrategy';

export class ExternalCache extends CacheStrategy {
    private baseUrl: string;
    private options: CacheOptions;

    constructor(options: CacheOptions) {
        super();
        this.options = options;
        this.baseUrl = options.externalCacheUrl!;
    }

    async set(key: string, value: Buffer): Promise<void> {
        await fetch(`${this.baseUrl}/cache/${key}`, {
        method: 'POST',
        body: value,
        headers: {
            'Content-Type': 'application/octet-stream',
            'TTL': this.options.ttl.toString()
        }
        });
    }

    async get(key: string): Promise<Buffer | null> {
        const response = await fetch(`${this.baseUrl}/cache/${key}`);
        return response.ok ? Buffer.from(await response.arrayBuffer()) : null;
    }

    async preload(key: string): Promise<void> {
        if (this.options.preloadNextChunk) {
        const nextChunkKey = this.getNextChunkKey(key);
        await fetch(`${this.baseUrl}/preload/${nextChunkKey}`);
        }
    }

    async clear(): Promise<void> {
        await fetch(`${this.baseUrl}/cache`, { method: 'DELETE' });
    }

    private getNextChunkKey(currentKey: string): string {
        const parts = currentKey.split('_');
        const currentChunk = parseInt(parts[parts.length - 1]);
        parts[parts.length - 1] = (currentChunk + 1).toString();
        return parts.join('_');
    }
}