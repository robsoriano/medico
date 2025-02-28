// src/pages/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, Grid, Paper, Button, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { logout } from '../services/authService';
import { getAppointments } from '../services/appointmentService';
import { getUserName } from '../services/tokenService';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const username = getUserName();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // State for Daily Queue
  const [dailyQueueDate, setDailyQueueDate] = useState(new Date());
  const [dailyQueueAppointments, setDailyQueueAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');

  // Fetch appointments for the selected day
  useEffect(() => {
    const fetchDailyAppointments = async () => {
      setLoadingAppointments(true);
      try {
        const response = await getAppointments();
        const selectedDateString = dailyQueueDate.toISOString().split('T')[0];
        const daily = response.data.filter(
          (appointment) => appointment.appointment_date === selectedDateString
        );
        setDailyQueueAppointments(daily);
      } catch (error) {
        setAppointmentsError('Failed to fetch daily appointments.');
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchDailyAppointments();
  }, [dailyQueueDate]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Medical CRM - Doctor Dashboard
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
          <Grid container spacing={3}>
            {/* Daily Queue Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Daily Queue
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={dailyQueueDate}
                    onChange={(newValue) => newValue && setDailyQueueDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </LocalizationProvider>
                {loadingAppointments ? (
                  <Typography>Loading appointments...</Typography>
                ) : appointmentsError ? (
                  <Typography color="error">{appointmentsError}</Typography>
                ) : dailyQueueAppointments.length > 0 ? (
                  dailyQueueAppointments.map((appointment) => (
                    <Box key={appointment.id} sx={{ mt: 1, mb: 1, borderBottom: '1px solid #ccc', pb: 1 }}>
                      <Typography>
                        <strong>Patient ID:</strong> {appointment.patient_id}
                      </Typography>
                      <Typography>
                        <strong>Time:</strong> {appointment.appointment_time}
                      </Typography>
                      <Typography>
                        <strong>Doctor:</strong> {appointment.doctor}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography>No appointments scheduled for this day.</Typography>
                )}
              </Paper>
            </Grid>
            {/* Patient Files Section */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: 240 }}>
                <Typography variant="h6" gutterBottom>
                  Patient Files
                </Typography>
                <Button variant="contained" component={Link} to="/patients" sx={{ mt: 2 }}>
                  View Patient Records
                </Button>
              </Paper>
            </Grid>
            {/* Calendar View Section */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, height: 240 }}>
                <Typography variant="h6" gutterBottom>
                  Calendar View
                </Typography>
                <Button variant="contained" component={Link} to="/appointments/calendar" sx={{ mt: 2 }}>
                  View Full Calendar
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
