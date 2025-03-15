import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import './ChatPage.css';
import { v4 as uuidv4 } from 'uuid';

function ChatPage() {
    const { token } = useOutletContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const ws = useRef(null);
    const messagesEndRef = useRef(null);
    const username = localStorage.getItem('username');
    const clientId = localStorage.getItem('uuid') || uuidv4();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        localStorage.setItem('uuid', clientId);
        connectWebSocket();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const connectWebSocket = () => {
        try {
            ws.current = new WebSocket(`wss://xnl-backend.onrender.com/ws/${clientId}`);

            ws.current.onopen = () => {
                setIsConnected(true);
                setError(null);
                setMessages(prev => [...prev, { 
                    type: 'system', 
                    message: 'Connected to chat!' 
                }]);
            };

            ws.current.onmessage = (event) => {
                try {
                    const parsedMessage = JSON.parse(event.data);
                    setMessages(prev => [...prev, { ...parsedMessage, type: 'message' }]);
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            };

            ws.current.onerror = () => {
                setError("Connection error. Please try again later.");
                setIsConnected(false);
            };

            ws.current.onclose = () => {
                setIsConnected(false);
                setMessages(prev => [...prev, { 
                    type: 'system', 
                    message: 'Disconnected from chat. Reconnecting...' 
                }]);
                setTimeout(connectWebSocket, 5000);
            };
        } catch (error) {
            setError("Failed to connect to chat. Please try again later.");
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (ws.current && newMessage.trim() && isConnected) {
            try {
                ws.current.send(JSON.stringify({
                    message: newMessage,
                    username: username || 'Anonymous',
                }));
                setNewMessage('');
            } catch (error) {
                setError("Failed to send message. Please try again.");
            }
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                <div className="chat-header">
                    <h2>💬 Live Chat</h2>
                    <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                    </span>
                </div>

                <div className="messages-container">
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} 
                             className={`message ${msg.type === 'system' 
                                 ? 'system' 
                                 : msg.username === username 
                                     ? 'sent' 
                                     : 'received'}`}>
                            {msg.type === 'system' ? (
                                <span className="system-message">{msg.message}</span>
                            ) : (
                                <div className="message-content">
                                    <span className="message-username">{msg.username}</span>
                                    <span className="message-text">{msg.message}</span>
                                    <span className="message-time">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-form">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={!isConnected}
                    />
                    <button type="submit" disabled={!isConnected || !newMessage.trim()}>
                        Send 📤
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatPage;