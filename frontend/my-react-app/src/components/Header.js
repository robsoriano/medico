import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <h1>Medical CRM</h1>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
