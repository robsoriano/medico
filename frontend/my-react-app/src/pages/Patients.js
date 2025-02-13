// src/pages/Patients.js
import React, { useState } from 'react';
import PatientForm from '../components/PatientForm';
import PatientList from '../pages/PatientList';

const Patients = () => {
  const [patientAdded, setPatientAdded] = useState(null);

  // Optionally, trigger a refresh in PatientList when a patient is added.
  // For simplicity, PatientList already fetches the patient list on mount.

  const handlePatientAdded = (data) => {
    // You could trigger a state update or simply log the new patient
    console.log('New patient added:', data);
    setPatientAdded(data); // This can be used to force a re-render or notify the user.
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Patients</h2>
      <PatientForm onPatientAdded={handlePatientAdded} />
      <PatientList />
    </div>
  );
};

export default Patients;
