import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export const VideoUploader = ({ onUpload, disabled }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
        dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        id="video-upload"
        accept="video/*"
        onChange={handleChange}
        disabled={disabled}
      />
      <label htmlFor="video-upload" className={disabled ? '' : 'cursor-pointer'}>
        <Upload className="w-16 h-16 mx-auto mb-4 text-purple-500" />
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Click to upload or drag and drop
        </p>
        <p className="text-sm text-gray-500">
          MP4, MOV, AVI, MKV (MAX. 500MB)
        </p>
      </label>
    </div>
  );
};
