// engines/GStreamerEngine.ts
import { spawn } from 'child_process';
import { VideoEngine } from '../core/VideoEngine';
import { QualityLevel } from '../core/types';

export class GStreamerEngine extends VideoEngine {
    async processChunk(
        inputPath: string,
        outputPath: string,
        startTime: number,
        quality: QualityLevel
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const gst = spawn('gst-launch-1.0', [
                'filesrc', `location=${inputPath}`,
                '!', 'decodebin',
                '!', 'videoconvert',
                '!', 'videoscale',
                '!', `video/x-raw,width=-1,height=${quality.height}`,
                '!', 'x264enc', `bitrate=${quality.bitrate}`,
                '!', 'mp4mux', '!', 'filesink', `location=${outputPath}`
            ]);

            gst.on('close', code => {
                code === 0 ? resolve() : reject(new Error(`GStreamer error: ${code}`));
            });
        });
    }

    async getDuration(inputPath: string): Promise<number> {
        return new Promise((resolve, reject) => {
            const gst = spawn('gst-launch-1.0', [
                'filesrc', `location=${inputPath}`,
                '!', 'decodebin',
                '!', 'identity', '-debug', 'duration'
            ]);

            let output = '';
            gst.stdout.on('data', data => output += data);
            gst.on('close', code => {
                code === 0 ? resolve(parseFloat(output)) : reject(new Error(`GStreamer error: ${code}`));
            });
        });
    }
}
