import React from 'react';
import '../css/Dashboard.css';
import LogoutButton from './LogoutButton'; 

const Dashboard = () => {
    return (
        <div>
            <nav className="navbar">
                <div className="navbar-brand">
                    <h1>Buy Store</h1>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>
            <div className="dashboard-content">
                <h1>Welcome to the Dashboard</h1>
                {/* Other dashboard content goes here */}
            </div>
        </div>
    );
};

export default Dashboard;
