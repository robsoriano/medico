// src/components/PatientForm.js
import React, { useState } from 'react';
import { addPatient } from '../services/patientService';
import { getUserRole } from '../services/tokenService';

const PatientForm = ({ onPatientAdded }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [homePhone, setHomePhone] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [medicalInsurance, setMedicalInsurance] = useState('');
  const [error, setError] = useState('');

  // Get the current user's role
  const role = getUserRole();
  const allowedRoles = ['doctor', 'secretary'];

  // Only render the form if the user has one of the allowed roles
  if (!allowedRoles.includes(role)) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields: first name, last name, and email are required
    if (!firstName || !lastName || !email) {
      setError('First name, Last name, and Email are required.');
      return;
    }
    // Build the patient data payload
    const patientData = {
      first_name: firstName,
      last_name: lastName,
      email,
      age: age ? parseInt(age, 10) : null,
      // birthDate will be a string in "YYYY-MM-DD" format or null
      birth_date: birthDate ? birthDate : null,
      home_address: homeAddress.trim() !== '' ? homeAddress : null,
      home_phone: homePhone.trim() !== '' ? homePhone : null,
      personal_phone: personalPhone.trim() !== '' ? personalPhone : null,
      occupation: occupation.trim() !== '' ? occupation : null,
      medical_insurance: medicalInsurance.trim() !== '' ? medicalInsurance : null,
    };

    // Log the payload for debugging purposes
    console.log("Payload:", patientData);

    try {
      const response = await addPatient(patientData);
      onPatientAdded(response.data);
      // Reset form fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setAge('');
      setBirthDate('');
      setHomeAddress('');
      setHomePhone('');
      setPersonalPhone('');
      setOccupation('');
      setMedicalInsurance('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to add patient.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div>
        <label>Birth Date:</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>
      <div>
        <label>Home Address:</label>
        <input
          type="text"
          value={homeAddress}
          onChange={(e) => setHomeAddress(e.target.value)}
        />
      </div>
      <div>
        <label>Home Phone:</label>
        <input
          type="text"
          value={homePhone}
          onChange={(e) => setHomePhone(e.target.value)}
        />
      </div>
      <div>
        <label>Personal Phone:</label>
        <input
          type="text"
          value={personalPhone}
          onChange={(e) => setPersonalPhone(e.target.value)}
        />
      </div>
      <div>
        <label>Occupation:</label>
        <input
          type="text"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
        />
      </div>
      <div>
        <label>Medical Insurance:</label>
        <input
          type="text"
          value={medicalInsurance}
          onChange={(e) => setMedicalInsurance(e.target.value)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Add Patient</button>
    </form>
  );
};

export default PatientForm;
