import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';  // Import Header
import Login from './pages/Login';
import Patients from './pages/Patients';
import { getAuthToken } from './services/authService';

const PrivateRoute = ({ element }) => {
  return getAuthToken() ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Header /> {/* Now Header is rendered on all pages */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/patients" element={<PrivateRoute element={<Patients />} />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;


