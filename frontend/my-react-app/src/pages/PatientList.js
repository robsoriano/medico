// src/components/PatientList.js
import React, { useState } from 'react';
import { deletePatient, updatePatient } from '../services/patientService';
import { getUserRole } from '../services/tokenService';

const PatientList = ({ patients, setPatients }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  // Get the current user's role from the JWT token
  const role = getUserRole();

  // Define allowed roles for editing/deleting patients
  const allowedRoles = ['doctor', 'secretary'];

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      setPatients(patients.filter(patient => patient.id !== id));
    } catch (err) {
      alert('Failed to delete patient.');
    }
  };

  const startEditing = (patient) => {
    setEditingId(patient.id);
    setEditedName(patient.name);
    setEditedEmail(patient.email);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedName('');
    setEditedEmail('');
  };

  const handleUpdate = async (id) => {
    try {
      await updatePatient(id, { name: editedName, email: editedEmail });
      setPatients(patients.map(patient => 
        patient.id === id ? { ...patient, name: editedName, email: editedEmail } : patient
      ));
      setEditingId(null);
    } catch (err) {
      alert('Failed to update patient.');
    }
  };

  return (
    <div>
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
                  {allowedRoles.includes(role) && (
                    <>
                      <button onClick={() => startEditing(patient)} style={{ marginLeft: '1rem' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(patient.id)} style={{ marginLeft: '0.5rem' }}>
                        Delete
                      </button>
                    </>
                  )}
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
