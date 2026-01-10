import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import videoProcessorService from '../services/videoProcessor.js';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp4|mov|avi|mkv|webm/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only video files are allowed!'));
    }
});

// Upload and process video
router.post('/upload', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        const socketId = req.body.socketId;
        const io = req.app.get('io');

        // Start processing asynchronously
        videoProcessorService.processVideo(req.file.path, socketId, io)
            .catch(error => {
                console.error('Processing error:', error);
            });

        res.json({
            message: 'Video uploaded successfully. Processing started.',
            filename: req.file.filename,
            size: req.file.size
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get video manifest
router.get('/manifest/:videoId', async (req, res) => {
    try {
        const manifest = await videoProcessorService.getManifest(req.params.videoId);
        res.json(manifest);
    } catch (error) {
        res.status(404).json({ error: 'Manifest not found' });
    }
});

// Stream video chunk
router.get('/stream/:videoId/:quality/:chunk', async (req, res) => {
    try {
        const { videoId, quality, chunk } = req.params;
        const stream = await videoProcessorService.streamChunk(
            videoId,
            parseInt(quality),
            parseInt(chunk)
        );

        res.setHeader('Content-Type', 'video/mp4');
        stream.pipe(res);
    } catch (error) {
        res.status(404).json({ error: 'Chunk not found' });
    }
});

export default router;
