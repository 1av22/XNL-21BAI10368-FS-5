import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import UploadPage from './pages/UploadPage';
import VideosPage from './pages/VideosPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';

function App() {
    const [token, setToken] = useState({
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token'),
    });

    useEffect(() => {
        setToken({
            access_token: localStorage.getItem('access_token'),
            refresh_token: localStorage.getItem('refresh_token'),
        });
    }, [localStorage.getItem('access_token'), localStorage.getItem('refresh_token')]);

    const handleLogin = (newTokens) => {
        setToken(newTokens);
        localStorage.setItem('access_token', newTokens.access_token);
        localStorage.setItem('refresh_token', newTokens.refresh_token);
    };

    const handleLogout = () => {
        setToken({ access_token: null, refresh_token: null });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home token={token} handleLogout={handleLogout} />}>
                    <Route path="upload" element={<UploadPage />} />
                    <Route path="videos" element={<VideosPage />} />
                    <Route path="chat" element={<ChatPage />} />  {/* Changed route path */}
                </Route>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<RegistrationPage />} />
            </Routes>
        </Router>
    );
}

export default App;