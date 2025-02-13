// src/components/PatientList.js
import React, { useState, useEffect } from 'react';
import { getPatients, deletePatient, updatePatient } from '../services/patientService';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // New state for editing
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  console.log("PatientList re-rendering with patients:", patients);

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

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      // Update the list after deletion
      setPatients(patients.filter(patient => patient.id !== id));
    } catch (err) {
      alert('Failed to delete patient.');
    }
  };

  // Start editing a patient
  const startEditing = (patient) => {
    setEditingId(patient.id);
    setEditedName(patient.name);
    setEditedEmail(patient.email);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditedName('');
    setEditedEmail('');
  };

  // Handle updating the patient
  const handleUpdate = async (id) => {
    try {
      await updatePatient(id, { name: editedName, email: editedEmail });
      // Update the state directly with the edited values
      setPatients(patients.map(patient => 
        patient.id === id ? { ...patient, name: editedName, email: editedEmail } : patient
      ));
      setEditingId(null);
    } catch (err) {
      alert('Failed to update patient.');
    }
  };

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Patient List</h2>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <ul>
          {patients.map(patient => (
            <li key={patient.id} style={{ marginBottom: '0.5rem' }}>
              {editingId === patient.id ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(patient.id)}>Save</button>
                  <button onClick={cancelEditing} style={{ marginLeft: '0.5rem' }}>Cancel</button>
                </>
              ) : (
                <>
                  {patient.name} ({patient.email})
                  <button onClick={() => startEditing(patient)} style={{ marginLeft: '1rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(patient.id)} style={{ marginLeft: '0.5rem' }}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientList;
