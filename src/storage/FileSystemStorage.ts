
// storage/FileSystemStorage.ts
import { promises as fs } from 'fs';
import { StorageProvider } from './StorageProvider';

export class FileSystemStorage extends StorageProvider {
    async saveChunk(chunkPath: string, data: Buffer): Promise<void> {
        await fs.writeFile(chunkPath, data);
    }

    async getChunk(chunkPath: string): Promise<Buffer> {
        return fs.readFile(chunkPath);
    }

    async deleteChunk(chunkPath: string): Promise<void> {
        await fs.unlink(chunkPath);
    }
}