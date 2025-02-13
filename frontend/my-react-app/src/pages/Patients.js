// src/pages/Patients.js
import React, { useState, useEffect } from 'react';
import PatientForm from '../components/PatientForm';
import PatientList from '../pages/PatientList';
import { getPatients } from '../services/patientService';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Function to fetch patients from the backend
  const fetchPatients = async () => {
    console.log("Fetching patients...");
    try {
      const response = await getPatients();
      console.log("Fetched patients:", response.data);
      setPatients([...response.data]); // Force a new array instance
      setLoading(false);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError('Failed to fetch patients.');
      setLoading(false);
    }
  };

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Callback function when a new patient is added
  const handlePatientAdded = async (newPatient) => {
    console.log("Patient added callback:", newPatient);
    setMessage('Patient added successfully!');
    setTimeout(() => {
      console.log("Re-fetching patients after delay...");
      fetchPatients();
      setMessage('');
    }, 3000);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Patients</h2>
      {/* Display success message */}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {/* Patient form for adding a new patient */}
      <PatientForm onPatientAdded={handlePatientAdded} />
      {loading ? (
        <p>Loading patients...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <PatientList patients={patients} setPatients={setPatients} key={patients.length} />
      )}
    </div>
  );
};

export default Patients;

