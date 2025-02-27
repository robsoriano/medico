// src/components/TestRole.js
import React from 'react';
import { getUserRole } from '../services/tokenService';

const TestRole = () => {
  const role = getUserRole();
  return (
    <div>
      <h3>User Role:</h3>
      <p>{role ? role : "No role found (or not logged in)"}</p>
    </div>
  );
};

export default TestRole;
