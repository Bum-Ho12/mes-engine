# Caching Strategies

Intelligent caching is built into `mes-engine` to reduce storage latency and improve streaming performance.

## Cache Options

The `CacheOptions` interface defines how the cache behaves:

```typescript
interface CacheOptions {
    maxSize: number;           // Maximum size of the cache in bytes
    ttl: number;               // Time To Live in seconds
    preloadNextChunk: boolean; // Whether to automatically fetch the next chunk
}
```

## Supported Strategies

### `InternalCache`
A memory-based cache using a Least Recently Used (LRU) eviction policy. It is highly effective for hot content.

```typescript
import { InternalCache, FileSystemStorage } from 'mes-engine';

const storage = new FileSystemStorage();
const cache = new InternalCache({
    maxSize: 1024 * 1024 * 500, // 500MB
    ttl: 3600,
    preloadNextChunk: true
}, storage);
```

## Key Features

### Next-Chunk Preloading
When `preloadNextChunk` is enabled, the `InternalCache` will automatically attempt to fetch the next sequential chunk (e.g., `chunk_1` if `chunk_0` was requested) and store it in memory. This significantly reduces buffer times for sequential playback.

## Custom Caching

You can implement your own strategy (e.g., using Redis) by extending the `CacheStrategy` class:

```typescript
import { CacheStrategy } from 'mes-engine';

class RedisCache extends CacheStrategy {
    async set(key: string, value: Buffer): Promise<void> {
        // Redis SETEX
    }

    async get(key: string): Promise<Buffer | null> {
        // Redis GET
    }

    async preload(key: string): Promise<void> {
        // Custom preloading logic
    }

    async clear(): Promise<void> {
        // Redis FLUSHDB
    }
}
```
