// src/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import "./Home.css";

function Home({ token, handleLogout }) {
  return (
    <div className="app-container">
      <Navbar token={token} handleLogout={handleLogout} />
      {!token || !token.access_token ? (
        <div className="home-unauthenticated">
          <h1>🎥 Welcome to VideoVibe</h1>
          <p>Share your moments, connect with others, and explore amazing content in our creative community. Start your journey today! ✨</p>
          <div className="auth-links">
            <Link to="/login">
              <span className="link-icon">👋</span> Login
            </Link>
            <Link to="/register">
              <span className="link-icon">🚀</span> Join Now
            </Link>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📤</span>
              <h3>Easy Upload</h3>
              <p>Share your videos in just a few clicks</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💬</span>
              <h3>Live Chat</h3>
              <p>Connect with viewers in real-time</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h3>Smart Analysis</h3>
              <p>Get insights about your content</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="home-authenticated">
          <h1>Welcome Back! 👋</h1>
          <p>Ready to create and share something amazing?</p>
          <div className="quick-actions">
            <Link to="/upload" className="action-button">
              <span className="action-icon">📤</span>
              Upload New Video
            </Link>
            <Link to="/videos" className="action-button">
              <span className="action-icon">🎬</span>
              Browse Videos
            </Link>
            <Link to="/chat" className="action-button">
              <span className="action-icon">💭</span>
              Join Chat
            </Link>
          </div>
          <Outlet context={{ token: token }} />
        </div>
      )}
    </div>
  );
}

export default Home;