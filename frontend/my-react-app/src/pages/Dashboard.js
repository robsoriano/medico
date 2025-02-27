// src/pages/Dashboard.js
import React from 'react';
import { getUserRole } from '../services/tokenService';
import DoctorDashboard from './DoctorDashboard';
import SecretaryDashboard from './SecretaryDashboard';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  const role = getUserRole();

  if (role === 'doctor') {
    return <DoctorDashboard />;
  } else if (role === 'secretary') {
    return <SecretaryDashboard />;
  } else {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Access Denied: Unknown role.
        </Typography>
      </Box>
    );
  }
};

export default Dashboard;
