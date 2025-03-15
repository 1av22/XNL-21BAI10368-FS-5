import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './RegistrationPage.css';

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await axios.post('https://xnl-backend.onrender.com/register', {
                username: username,
                password: password,
            });
            alert('Registration successful!');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('Registration failed! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-page">
            <div className="registration-container">
                <div className="registration-header">
                    <h2>Join Us! 🚀</h2>
                    <p>Create your account to get started</p>
                </div>
                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-group">
                        <span>👤</span>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <span>🔒</span>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
                <div className="login-link">
                    <span>Already have an account?</span>
                    <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default RegistrationPage;