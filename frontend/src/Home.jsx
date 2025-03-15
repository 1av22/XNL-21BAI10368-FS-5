// src/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Outlet, useOutletContext } from 'react-router-dom';
import "./Home.css";

function Home({ token, handleLogout }) {
  return (
    <div>
      <Navbar token={token} handleLogout={handleLogout} />
      {!token || !token.access_token ? (
        <div className="home-unauthenticated">
          <h1>Welcome to Our Video Sharing Platform!</h1>
          <p>Please log in or register to access the platform's features.</p>
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      ) : (
          <div>
            <h1>Welcome to the application.</h1>
            <p>You can upload videos from the upload section and view them in the videos section.</p>
          <Outlet context={{ token: token }} />
        </div>
      )}
    </div>
  );
}

export default Home;