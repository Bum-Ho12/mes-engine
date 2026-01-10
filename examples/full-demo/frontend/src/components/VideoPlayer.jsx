import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const VideoPlayer = ({ manifest, quality, onQualityChange }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative bg-black">
        <video
          ref={videoRef}
          className="w-full"
          src={`http://localhost:3001/api/video/stream/${manifest.videoId}/${quality}/${currentChunk}`}
          onEnded={() => {
            if (currentChunk < manifest.chunks.length / manifest.qualities.length - 1) {
              setCurrentChunk(currentChunk + 1);
            }
          }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button onClick={toggleMute} className="hover:scale-110 transition-transform">
                {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <span className="text-sm">
                Chunk {currentChunk + 1}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm mr-2">Quality:</span>
              {manifest.qualities.map((q) => (
                <button
                  key={q.height}
                  onClick={() => onQualityChange(q.height)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                    quality === q.height
                      ? 'bg-purple-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {q.height}p
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-2">Video Information</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>ID: {manifest.videoId}</div>
          <div>Created: {new Date(manifest.metadata.createdAt).toLocaleString()}</div>
          <div>Qualities: {manifest.qualities.length}</div>
          <div>Chunks: {manifest.chunks.length}</div>
        </div>
      </div>
    </div>
  );
};
