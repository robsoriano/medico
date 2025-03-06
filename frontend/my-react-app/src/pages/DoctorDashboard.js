// src/pages/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  Pagination
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { logout } from '../services/authService';
import { getUserName } from '../services/tokenService';
import CurrentTime from '../components/CurrentTime';
import { getAppointments } from '../services/appointmentService';
import { useSimpleLanguage } from '../context/SimpleLanguageContext';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const username = getUserName();
  const { t } = useSimpleLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Daily Queue state
  const [dailyQueueDate, setDailyQueueDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [dailyQueueAppointments, setDailyQueueAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');

  // Pagination state for Daily Queue
  const [dailyQueuePage, setDailyQueuePage] = useState(1);
  const dailyQueuePageSize = 3;

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await getAppointments();
      setAppointments(response.data);
      setAppointmentsError('');
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointmentsError(t('failedToFetchAppointments') || 'Failed to fetch daily appointments.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments for Daily Queue based on selected date
  useEffect(() => {
    if (!dailyQueueDate) return;
    const queueDateString = dailyQueueDate.toISOString().split('T')[0];
    const daily = appointments.filter(
      (appt) => appt.appointment_date === queueDateString
    );
    setDailyQueueAppointments(daily);
    setDailyQueuePage(1); // Reset page when date changes
  }, [dailyQueueDate, appointments]);

  // Pagination calculations for Daily Queue
  const dailyQueuePageCount = Math.ceil(dailyQueueAppointments.length / dailyQueuePageSize);
  const startIndex = (dailyQueuePage - 1) * dailyQueuePageSize;
  const endIndex = startIndex + dailyQueuePageSize;
  const dailyQueuePaginated = dailyQueueAppointments.slice(startIndex, endIndex);

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
          <CurrentTime />
          <Grid container spacing={3}>
            {/* Daily Queue Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('dailyQueue')}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('selectDate')}
                    value={dailyQueueDate}
                    onChange={(newValue) => setDailyQueueDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </LocalizationProvider>
                {loadingAppointments ? (
                  <Typography>Loading appointments...</Typography>
                ) : appointmentsError ? (
                  <Typography color="error">{appointmentsError}</Typography>
                ) : dailyQueuePaginated.length > 0 ? (
                  <>
                    {dailyQueuePaginated.map((appointment) => (
                      <Paper key={appointment.id} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle1">
                          <strong>Patient:</strong> {appointment.patient_name}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date:</strong> {appointment.appointment_date}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Time:</strong> {appointment.appointment_time}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Doctor:</strong> {appointment.doctor}
                        </Typography>
                      </Paper>
                    ))}
                    {dailyQueuePageCount > 1 && (
                      <Pagination
                        count={dailyQueuePageCount}
                        page={dailyQueuePage}
                        onChange={(event, value) => setDailyQueuePage(value)}
                        sx={{ mt: 2 }}
                      />
                    )}
                  </>
                ) : (
                  <Typography>{t('noAppointmentsScheduled')}</Typography>
                )}
              </Paper>
            </Grid>
            {/* Other sections of DoctorDashboard can follow here */}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
