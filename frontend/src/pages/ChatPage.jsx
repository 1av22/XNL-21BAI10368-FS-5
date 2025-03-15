import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import './ChatPage.css';

function ChatPage() {
    const { token } = useOutletContext();
    const [messages, setMessages] = useState();
    const [newMessage, setNewMessage] = useState('');
    const ws = useRef(null);
    const username = localStorage.getItem('username');
    const clientId = localStorage.getItem('uuid');
    const roomId = "global_chat";  // Fixed room ID

    useEffect(() => {
        console.log("ChatPage - roomId:", roomId);
        console.log("ChatPage - clientId:", clientId);

        ws.current = new WebSocket(`wss://xnl-backend.onrender.com/ws/${clientId}`); // Updated to wss for secure connection

        ws.current.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.current.onmessage = (event) => {
            try {
                const receivedData = event.data;
                console.log("Received data:", receivedData);
                const parsedMessage = JSON.parse(receivedData);
                console.log("Parsed message:", parsedMessage);
                setMessages(prevMessages => [...prevMessages, parsedMessage]);
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.current.onclose = (event) => {
            console.log("WebSocket disconnected", event.code);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [clientId]);  // Removed roomId from dependency array

    const handleSendMessage = () => {
        if (ws.current && newMessage) {
            const message = {
                message: newMessage,
                username: username,
            };
            ws.current.send(JSON.stringify(message));
            setNewMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages && messages.map((msg, index) => (
                    <div key={index} className="message">
                        <span className="message-username">{msg.username}:</span>
                        <span className="message-text">{msg.message}</span>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="send-button" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatPage;