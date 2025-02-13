// src/components/PatientForm.js
import React, { useState } from 'react';
import { addPatient } from '../services/patientService';

const PatientForm = ({ onPatientAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Both name and email are required.');
      return;
    }
    try {
      const response = await addPatient({ name, email });
      onPatientAdded(response.data);
      setName('');
      setEmail('');
      setError('');
    } catch (err) {
      setError('Failed to add patient.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Add Patient</button>
    </form>
  );
};

export default PatientForm;
