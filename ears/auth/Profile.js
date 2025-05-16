import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch user data from the backend
        const fetchUserData = async () => {
            try {
                // You'll need to ensure this endpoint exists and returns the logged-in user's data
                // Also, ensure your backend handles authentication for this route
                const token = localStorage.getItem('token'); // Or however you store your auth token
                if (!token) {
                    setMessage('User not authenticated');
                    return;
                }
                const response = await axios.get('/api/user/profile', { // Adjust the endpoint as needed
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setName(response.data.name);
                setEmail(response.data.email);
            } catch (error) {
                setMessage('Error fetching user data. Please ensure you are logged in.');
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        try {
            const token = localStorage.getItem('token'); // Or however you store your auth token
            if (!token) {
                setMessage('User not authenticated. Cannot update profile.');
                return;
            }
            // You'll need to ensure this endpoint exists and can update the user's data
            // Also, ensure your backend handles authentication for this route
            await axios.put('/api/user/profile', { name, email }, { // Adjust the endpoint as needed
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(`Error updating profile: ${error.response.data.message}`);
            } else {
                setMessage('Error updating profile. Please try again.');
            }
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="container">
            <h2>User Profile</h2>
            {message && <p className={message.startsWith('Error') ? "error-message" : "success-message"}>{message}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile; 