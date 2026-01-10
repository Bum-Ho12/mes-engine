import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const uploadVideo = async (file, socketId, onProgress) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('socketId', socketId);

    return axios.post(`${API_BASE_URL}/video/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
        },
    });
};

export const getManifest = async (videoId) => {
    const response = await axios.get(`${API_BASE_URL}/video/manifest/${videoId}`);
    return response.data;
};

export const getStreamUrl = (videoId, quality, chunk) => {
    return `${API_BASE_URL}/video/stream/${videoId}/${quality}/${chunk}`;
};
