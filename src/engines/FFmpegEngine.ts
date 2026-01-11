// src/engines/FFmpegEngine.ts
import { VideoEngine } from '../core/VideoEngine.js';
import { QualityLevel } from '../core/types.js';
import { spawn } from 'child_process';
import fs from 'fs';
import { dirname } from 'path';

/**
 * FFmpeg implementation of the VideoEngine.
 * Requires `ffmpeg` and `ffprobe` to be installed on the system path.
 */
export class FFmpegEngine extends VideoEngine {
    /**
     * Processes a chunk of video using FFmpeg.
     *
     * @param inputPath - The path to the input video file.
     * @param outputPath - The path where the processed video chunk will be saved.
     * @param startTime - The start time (in seconds) of the chunk to process.
     * @param quality - The desired quality level for the output video.
     * @returns A Promise that resolves when the chunk is processed, or rejects on error.
     */
    async processChunk(
        inputPath: string,
        outputPath: string,
        startTime: number,
        quality: QualityLevel
    ): Promise<void> {
        // Ensure output directory exists
        await fs.promises.mkdir(dirname(outputPath), { recursive: true });

        return new Promise((resolve, reject) => {
            const args = [
                '-i', inputPath,
                '-ss', startTime.toString(),
                '-t', '10',
                // Force dimensions divisible by 2 for H.264 encoding
                // The scale filter with -2 rounds to the nearest even number
                '-vf', `scale=-2:${quality.height}`,
                '-c:v', 'libx264',
                '-b:v', quality.bitrate,
                '-c:a', 'aac',
                '-b:a', '128k',
                '-preset', 'fast',
                // Use yuv420p for maximum compatibility
                '-pix_fmt', 'yuv420p',
                '-y',
                outputPath
            ];

            const ffmpegProcess = spawn('ffmpeg', args);

            let stderr = '';

            ffmpegProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            ffmpegProcess.on('error', (err) => {
                reject(new Error(`Failed to spawn FFmpeg: ${err.message}`));
            });

            ffmpegProcess.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    console.error('FFmpeg stderr:', stderr);
                    reject(new Error(`FFmpeg error: ${code}\nCommand: ffmpeg ${args.join(' ')}\nStderr: ${stderr}`));
                }
            });
        });
    }

    async extractScreenshot(
        inputPath: string,
        outputPath: string,
        time: number
    ): Promise<void> {
        // Ensure output directory exists
        await fs.promises.mkdir(dirname(outputPath), { recursive: true });

        return new Promise((resolve, reject) => {
            const args = [
                '-ss', time.toString(),
                '-i', inputPath,
                '-vframes', '1',
                '-q:v', '2',
                '-y',
                outputPath
            ];

            const ffmpegProcess = spawn('ffmpeg', args);

            let stderr = '';

            ffmpegProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            ffmpegProcess.on('error', (err) => {
                reject(new Error(`Failed to spawn FFmpeg for screenshot: ${err.message}`));
            });

            ffmpegProcess.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    console.error('FFmpeg screenshot stderr:', stderr);
                    reject(new Error(`FFmpeg screenshot error: ${code}\nCommand: ffmpeg ${args.join(' ')}\nStderr: ${stderr}`));
                }
            });
        });
    }

    async getDuration(inputPath: string): Promise<number> {
        // Use ffprobe for more reliable duration detection
        return new Promise((resolve, reject) => {
            const ffprobeProcess = spawn('ffprobe', [
                '-v', 'error',
                '-show_entries', 'format=duration',
                '-of', 'default=noprint_wrappers=1:nokey=1',
                inputPath
            ]);

            let stdout = '';
            let stderr = '';

            ffprobeProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            ffprobeProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            ffprobeProcess.on('error', (err) => {
                // Fallback to buffer parsing if ffprobe not available
                console.warn('ffprobe not available, falling back to buffer parsing');
                this.getDurationFromBuffer(inputPath)
                    .then(resolve)
                    .catch(reject);
            });

            ffprobeProcess.on('close', (code) => {
                if (code === 0) {
                    const duration = parseFloat(stdout.trim());
                    if (!isNaN(duration)) {
                        resolve(duration);
                    } else {
                        reject(new Error('Could not parse duration'));
                    }
                } else {
                    // Fallback to buffer parsing
                    this.getDurationFromBuffer(inputPath)
                        .then(resolve)
                        .catch(reject);
                }
            });
        });
    }

    private async getDurationFromBuffer(inputPath: string): Promise<number> {
        const buffer = await fs.promises.readFile(inputPath);

        // Parse MP4 moov atom for duration
        if (inputPath.endsWith('.mp4')) {
            return this.parseMp4Duration(buffer);
        }

        // For other formats, extract from file metadata
        return this.parseMediaDuration(buffer);
    }

    private parseMp4Duration(buffer: Buffer): number {
        const moovStart = buffer.indexOf(Buffer.from('moov'));
        if (moovStart === -1) return 0;

        const mvhdStart = buffer.indexOf(Buffer.from('mvhd'), moovStart);
        if (mvhdStart === -1) return 0;

        const timeScale = buffer.readUInt32BE(mvhdStart + 12);
        const duration = buffer.readUInt32BE(mvhdStart + 16);

        return duration / timeScale;
    }

    private parseMediaDuration(buffer: Buffer): number {
        // Look for duration metadata in file headers
        const durationStr = buffer.toString('utf8', 0, Math.min(1000, buffer.length));
        const match = durationStr.match(/duration["\s:]+(\d+\.?\d*)/i);
        return match ? parseFloat(match[1]) : 0;
    }
}