import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Patients from './pages/Patients';
import './App.css';

function App() {
  return (
  <div>
  <Header />
  <main style={{ padding: '1rem' }}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patients" element={<Patients />} />
    </Routes>
  </main>
  <Footer />
</div>
  );
}

export default App;