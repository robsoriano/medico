// src/pages/Patients.js
import React, { useState, useEffect } from 'react';
import PatientForm from '../components/PatientForm';
import PatientList from '../pages/PatientList';
import { getPatients } from '../services/patientService';

const Patients = () => {
  // State for patients, loading status, and error message
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch patients from the backend
  const fetchPatients = async () => {
    try {
      const response = await getPatients();
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patients.');
      setLoading(false);
    }
  };

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Callback function to refresh the list after a new patient is added
  const handlePatientAdded = (newPatient) => {
    // Option 1: Re-fetch the entire list
    fetchPatients();
    // Option 2: Alternatively, update the state directly:
    // setPatients([...patients, newPatient]);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Patients</h2>
      <PatientForm onPatientAdded={handlePatientAdded} />
      {loading ? (
        <p>Loading patients...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <PatientList patients={patients} setPatients={setPatients} />
      )}
    </div>
  );
};

export default Patients;
