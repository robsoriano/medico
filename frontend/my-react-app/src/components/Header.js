// src/components/Header.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../services/authService';
// For debugging, we'll comment out the condition for now
// import { getAuthToken } from '../services/authService';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h1>Medical CRM MVP</h1>
        <Link to="/patients" style={{ marginRight: '1rem' }}>Patients</Link>
      </div>
      <div>
        {/* For debugging: Always show logout button */}
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
          Logout
        </button>
        {/*
        // Original conditional rendering:
        {getAuthToken() && (
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
            Logout
          </button>
        )}
        */}
      </div>
    </header>
  );
};

export default Header;
