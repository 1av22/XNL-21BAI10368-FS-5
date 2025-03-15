import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ token, handleLogout }) {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
                {token && token.access_token ? (
                    <>
                        <li className="nav-item"><Link to="/upload" className="nav-link">Upload</Link></li>
                        <li className="nav-item"><Link to="/videos" className="nav-link">Videos</Link></li>
                        <li className="nav-item"><Link to="/chat" className="nav-link">Chat</Link></li> {/*Link to Chat */}
                        <li className="nav-item"><button onClick={handleLogout} className="nav-link logout-button">Logout</button></li>
                    </>
                ) : null}
            </ul>
        </nav>
    );
}

export default Navbar;