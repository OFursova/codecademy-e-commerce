import React from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/logout`);
            if (response.ok) {
                navigate('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};
export default LogoutButton;
