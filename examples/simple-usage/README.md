# Simple Usage Example

This example demonstrates the basic application of the `mes-engine` package to process a video into adaptive streaming chunks (HLS).

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [FFmpeg](https://ffmpeg.org/) installed and available in your PATH.

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Add an input video:**
    Place a video file named `input.mp4` in this directory (`examples/simple-usage/`).

3.  **Run the demo:**
    ```bash
    npm start
    ```

## What it does

- Initializes a `FileSystemStorage` to save output files in the `output/` directory.
- Uses `FFmpegEngine` for video transcoding.
- Configures `VideoProcessor` to generate two quality levels (720p and 1080p).
- Generates an HLS manifest (`.m3u8`) for adaptive streaming.
- Logs processing progress and the final manifest JSON to the console.
