// src/components/Dashboard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Grid, Paper, Box, Button } from '@mui/material';
import { logout } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="absolute">
        <Toolbar>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Medical CRM
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Welcome to your Dashboard
                </Typography>
                <Button variant="contained" component={Link} to="/patients" sx={{ mt: 2 }}>
                  Manage Patients
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Quick Stats
                </Typography>
                <Typography component="p" variant="h4">
                  1,234
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Total Patients
                </Typography>
                <Typography component="p" variant="h4">
                  42
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  New Patients This Month
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
