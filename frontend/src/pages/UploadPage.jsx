import React, { useState, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import './UploadPage.css';

function UploadPage() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragging(true);
        }
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleFileSelect = (selectedFile) => {
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setTitle(selectedFile.name);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            alert('Please select a valid video file');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        try {
            await axiosInstance.post('/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });
            alert('Video uploaded successfully!');
            setFile(null);
            setTitle('');
            setPreviewUrl(null);
            setUploadProgress(0);
        } catch (error) {
            console.error(error);
            alert('Video upload failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-container">
                <div className="upload-header">
                    <h2>🎬 Upload Your Video</h2>
                    <p>Share your creativity with the world</p>
                </div>

                <div 
                    className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                    onDragOver={handleDrag}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    {!file ? (
                        <>
                            <div className="upload-icon">📤</div>
                            <p>Drag & drop your video here or click to browse</p>
                            <span className="upload-hint">Supports MP4, WebM, and other video formats</span>
                        </>
                    ) : (
                        <div className="preview-container">
                            <video src={previewUrl} controls className="video-preview" />
                            <button 
                                className="remove-file"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    setPreviewUrl(null);
                                }}
                            >
                                ✖
                            </button>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        style={{ display: 'none' }}
                    />
                </div>

                {file && (
                    <form onSubmit={handleSubmit} className="upload-form">
                        <div className="form-group">
                            <label>Video Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a title for your video"
                                required
                            />
                        </div>

                        <button type="submit" className="upload-button" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Uploading...
                                </>
                            ) : (
                                <>Share Video 🚀</>
                            )}
                        </button>

                        {uploadProgress > 0 && (
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <span className="progress-text">{uploadProgress}%</span>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}

export default UploadPage;