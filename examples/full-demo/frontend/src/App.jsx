import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { VideoUploader } from './components/VideoUploader';
import { ProcessingStatus } from './components/ProcessingStatus';
import { VideoPlayer } from './components/VideoPlayer';
import { uploadVideo } from './services/api';

const socket = io('http://localhost:3001');

function App() {
  const [status, setStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [manifest, setManifest] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(720);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('processing:started', (data) => {
      setStatus('processing');
      addLog('Processing started');
    });

    socket.on('processing:progress', (progress) => {
      addLog(`Processing: ${progress.stage} - ${progress.percent}%`);
    });

    socket.on('processing:complete', (data) => {
      setStatus('complete');
      setManifest(data.manifest);
      addLog('Processing complete!');
    });

    socket.on('processing:error', (data) => {
      setStatus('error');
      addLog(`Error: ${data.error}`, 'error');
    });

    return () => {
      socket.off('connect');
      socket.off('processing:started');
      socket.off('processing:progress');
      socket.off('processing:complete');
      socket.off('processing:error');
    };
  }, []);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { 
      message, 
      type, 
      timestamp: Date.now() 
    }]);
  };

  const handleVideoUpload = async (file) => {
    try {
      setStatus('uploading');
      setUploadProgress(0);
      setLogs([]);
      
      addLog(`Uploading ${file.name}...`);
      
      await uploadVideo(file, socket.id, setUploadProgress);
      
      addLog('Upload complete, processing started...');
    } catch (error) {
      setStatus('error');
      addLog(`Upload failed: ${error.message}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            MES-Engine Demo
          </h1>
          <p className="text-xl text-gray-600">
            Multi-Engine Video Processing Framework
          </p>
        </div>

        {status === 'idle' && (
          <VideoUploader 
            onUpload={handleVideoUpload}
            disabled={status !== 'idle'}
          />
        )}

        <ProcessingStatus
          status={status}
          progress={uploadProgress}
          logs={logs}
        />

        {manifest && status === 'complete' && (
          <VideoPlayer
            manifest={manifest}
            quality={selectedQuality}
            onQualityChange={setSelectedQuality}
          />
        )}
      </div>
    </div>
  );
}

export default App;
