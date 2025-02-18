// src/components/Header.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, getAuthToken } from '../services/authService';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1>Medical CRM MVP</h1>
        <Link to="/patients" style={{ marginRight: '1rem' }}>Patients</Link>
      </div>
      <div>
        {getAuthToken() && (
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
