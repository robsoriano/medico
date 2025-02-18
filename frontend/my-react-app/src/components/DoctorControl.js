// src/components/DoctorControls.js
import React from 'react';
import { getUserRole } from '../services/tokenService';

const DoctorControls = () => {
  const role = getUserRole();

  // Only render if the user is a doctor
  if (role !== 'doctor') {
    return null;
  }

  return (
    <div>
      <h3>Doctor Controls</h3>
      <button>Edit Patient Details</button>
      <button>Delete Patient</button>
      {/* Add other doctor-specific UI elements here */}
    </div>
  );
};

export default DoctorControls;
