import React from 'react';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';

export const ProcessingStatus = ({ status, progress, logs }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader className="w-8 h-8 animate-spin text-purple-500" />;
      case 'complete':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading video...';
      case 'processing':
        return 'Processing video...';
      case 'complete':
        return 'Processing complete!';
      case 'error':
        return 'Processing failed';
      default:
        return '';
    }
  };

  if (!status || status === 'idle') return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        {getStatusIcon()}
        <h3 className="text-xl font-semibold ml-3">{getStatusText()}</h3>
      </div>

      {progress !== null && status === 'uploading' && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Upload Progress</span>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {logs && logs.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-700">Processing Logs</h4>
          <div className="bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto font-mono text-xs">
            {logs.map((log, index) => (
              <div key={index} className="text-green-400 mb-1">
                [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
