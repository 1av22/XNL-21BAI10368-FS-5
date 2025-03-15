// src/pages/VideosPage.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useOutletContext, Link } from 'react-router-dom';
import './VideosPage.css';

function VideosPage() {
    const { token } = useOutletContext();
    const [videos, setVideos] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axiosInstance.get('/videos');
                setVideos(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchVideos();
    }, [token]);

    if (loading) return <p>Loading videos...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="videos-page">
            <div className="videos-grid">
                {videos && videos.map((video) => (
                    <div key={video.id} className="video-item">
                        <video src={video.cloudinary_url} controls width="100%" />
                        <h3>{video.title}</h3>
                        <p>Sentiment: {JSON.stringify(video.sentiment)}</p>
                        {video.chat_room_id && (
                            <Link to={`/chat/${video.chat_room_id}`}>
                                Join Chat
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VideosPage;