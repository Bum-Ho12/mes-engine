
// streaming/StreamManager.ts
import { Readable } from 'stream';
import { StorageProvider } from '../storage/StorageProvider';

export class StreamManager {
    private storage: StorageProvider;

    constructor(storage: StorageProvider) {
        this.storage = storage;
    }

    async createStream(chunkPath: string, range?: { start: number; end: number }): Promise<Readable> {
        const data = await this.storage.getChunk(chunkPath);
        const stream = new Readable();

        if (range) {
        stream.push(data.slice(range.start, range.end + 1));
        } else {
        stream.push(data);
        }

        stream.push(null);
        return stream;
    }
}