// src/components/PatientList.js
import React, { useState, useEffect } from 'react';
import { getPatients, deletePatient } from '../services/patientService';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch patients on component mount
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
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      // Update the list after deletion
      setPatients(patients.filter(patient => patient.id !== id));
    } catch (err) {
      alert('Failed to delete patient.');
    }
  };

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Patient List</h2>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <ul>
          {patients.map(patient => (
            <li key={patient.id}>
              {patient.name} ({patient.email})
              <button onClick={() => handleDelete(patient.id)} style={{ marginLeft: '1rem' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientList;
