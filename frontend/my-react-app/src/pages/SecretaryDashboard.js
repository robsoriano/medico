// src/pages/SecretaryDashboard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, Grid, Paper, Button } from '@mui/material';
import { logout } from '../services/authService';
import { getUserName } from '../services/tokenService';
import CurrentTime from '../components/CurrentTime';

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const username = getUserName();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Medical CRM - Secretary Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          pt: 8,
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Welcome, {username}
          </Typography>
          <CurrentTime />
          <Grid container spacing={3}>
            {/* Appointment Scheduling Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 240 }}>
                <Typography variant="h6" gutterBottom>
                  Schedule Appointments
                </Typography>
                <Button variant="contained" component={Link} to="/appointments" sx={{ mt: 2 }}>
                  Manage Appointments
                </Button>
              </Paper>
            </Grid>
            {/* Patient Records Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 240 }}>
                <Typography variant="h6" gutterBottom>
                  Manage Patient Records
                </Typography>
                <Button variant="contained" component={Link} to="/patients" sx={{ mt: 2 }}>
                  View Patient Files
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default SecretaryDashboard;
