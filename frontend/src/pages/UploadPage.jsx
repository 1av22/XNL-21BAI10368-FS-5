import React, { useState } from 'react';
import axios from 'axios';
import './UploadPage.css';
import { useOutletContext } from 'react-router-dom'; // Import useOutletContext'
import axiosInstance from '../utils/axiosInstance';

function UploadPage() {
    const { token } = useOutletContext();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        try {
            await axiosInstance.post('/upload', formData, { // Use axiosInstance
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });
            alert('Video uploaded successfully!');
        } catch (error) {
            console.error(error);
            alert('Video upload failed!');
        }
    };

    return (
        <div className="upload-page">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Video Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit">Upload</button>
                {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
            </form>
        </div>
    );
}

export default UploadPage;