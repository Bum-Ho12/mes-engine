# Storage Providers

`mes-engine` uses an abstract storage layer to remain independent of where your video chunks are actually stored.

## Base Class: `StorageProvider`

All storage providers must extend the `StorageProvider` abstract class and implement its three core methods:

```typescript
export abstract class StorageProvider {
    abstract saveChunk(chunkPath: string, data: Buffer): Promise<void>;
    abstract getChunk(chunkPath: string): Promise<Buffer>;
    abstract deleteChunk(chunkPath: string): Promise<void>;
}
```

## Built-in Providers

### `FileSystemStorage`
The default provider for local development and on-premise deployments. It saves chunks directly to the server's disk.

```typescript
import { FileSystemStorage } from 'mes-engine';

const storage = new FileSystemStorage();
```

## Creating a Custom Provider

You can easily create a provider for S3, Azure Blob Storage, or any other service by extending `StorageProvider`.

### Example: S3 Storage Provider

```typescript
import { StorageProvider } from 'mes-engine';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

class S3Storage extends StorageProvider {
    private client = new S3Client({});

    async saveChunk(chunkPath: string, data: Buffer): Promise<void> {
        await this.client.send(new PutObjectCommand({
            Bucket: 'my-videos',
            Key: chunkPath,
            Body: data
        }));
    }

    async getChunk(chunkPath: string): Promise<Buffer> {
        // Implement S3 GetObject and return Buffer
    }

    async deleteChunk(chunkPath: string): Promise<void> {
        // Implement S3 DeleteObject
    }
}
```
