// src/pages/PatientList.js 
import React, { useState } from 'react';
import { deletePatient, updatePatient } from '../services/patientService';
import { getUserRole } from '../services/tokenService';
import { Link } from 'react-router-dom';

const PatientList = ({ patients, setPatients }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
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
    setEditedFirstName(patient.first_name);
    setEditedLastName(patient.last_name);
    setEditedEmail(patient.email);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedFirstName('');
    setEditedLastName('');
    setEditedEmail('');
  };

  const handleUpdate = async (id) => {
    try {
      await updatePatient(id, { 
        first_name: editedFirstName, 
        last_name: editedLastName, 
        email: editedEmail 
      });
      setPatients(patients.map(patient => 
        patient.id === id ? { 
          ...patient, 
          first_name: editedFirstName, 
          last_name: editedLastName, 
          email: editedEmail 
        } : patient
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
                    value={editedFirstName}
                    onChange={(e) => setEditedFirstName(e.target.value)}
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={editedLastName}
                    onChange={(e) => setEditedLastName(e.target.value)}
                    placeholder="Last Name"
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
                  {patient.first_name} {patient.last_name} ({patient.email})
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
                  <Link to={`/patients/${patient.id}`} style={{ marginLeft: '0.5rem', textDecoration: 'none' }}>
                    <button>View</button>
                  </Link>
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
