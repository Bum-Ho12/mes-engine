
// engines/FFmpegEngine.ts
import { spawn } from 'child_process';
import { VideoEngine } from '../core/VideoEngine';
import { QualityLevel } from '../core/types';

export class FFmpegEngine extends VideoEngine {
    async processChunk(
        inputPath: string,
        outputPath: string,
        startTime: number,
        quality: QualityLevel
    ): Promise<void> {
        return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i', inputPath,
            '-ss', startTime.toString(),
            '-t', '10',
            '-vf', `scale=-1:${quality.height}`,
            '-c:v', 'libx264',
            '-b:v', quality.bitrate,
            '-c:a', 'aac',
            '-b:a', '128k',
            '-preset', 'fast',
            '-y',
            outputPath
        ]);

        ffmpeg.on('close', code => {
            code === 0 ? resolve() : reject(new Error(`FFmpeg error: ${code}`));
        });
        });
    }

    async getDuration(inputPath: string): Promise<number> {
        return new Promise((resolve, reject) => {
        const ffprobe = spawn('ffprobe', [
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            inputPath
        ]);

        let output = '';
        ffprobe.stdout.on('data', data => output += data);
        ffprobe.on('close', code => {
            code === 0 ? resolve(parseFloat(output)) : reject(new Error(`FFprobe error: ${code}`));
        });
        });
    }
}