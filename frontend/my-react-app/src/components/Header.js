import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
      <h1>Medical CRM MVP</h1>
      <nav>
        {/* Use Link from react-router-dom for client-side navigation */}
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/patients">Patients</Link>
      </nav>
    </header>
  );
};

export default Header;