import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './RegistrationPage.css';

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://xnl-backend.onrender.com/register', {
                username: username,
                password: password,
            });
            console.log(response.data);
            alert('Registration successful!');
            navigate('/login'); // Redirect to login on successful registration
        } catch (error) {
            console.error(error);
            alert('Registration failed!');
        }
    };

    return (
        <div className="registration-page">
            <form onSubmit={handleSubmit} className="registration-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegistrationPage;