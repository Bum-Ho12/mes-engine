
// cache/CacheStrategy.ts
export interface CacheOptions {
    maxSize: number;
    ttl: number;
    preloadNextChunk: boolean;
    externalCacheUrl?: string;
}

export abstract class CacheStrategy {
    abstract set(key: string, value: Buffer): Promise<void>;
    abstract get(key: string): Promise<Buffer | null>;
    abstract preload(key: string): Promise<void>;
    abstract clear(): Promise<void>;
}