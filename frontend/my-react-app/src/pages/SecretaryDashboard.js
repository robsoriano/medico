// src/pages/SecretaryDashboard.js
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
import SimpleLanguageSwitcher from '../components/SimpleLanguageSwitcher';

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const username = getUserName();
  const { t } = useSimpleLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // State for all appointments (fetched from backend)
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Daily Queue state: default to current day
  const [dailyQueueDate, setDailyQueueDate] = useState(new Date());
  const [dailyQueueAppointments, setDailyQueueAppointments] = useState([]);
  
  // Pagination state for Daily Queue
  const [dailyQueuePage, setDailyQueuePage] = useState(1);
  const dailyQueuePageSize = 3;

  // Fetch all appointments when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAppointments();
      setAppointments(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments for Daily Queue based on the selected date
  useEffect(() => {
    if (!dailyQueueDate) return;
    const queueDateString = dailyQueueDate.toISOString().split('T')[0];
    const daily = appointments.filter(
      (appt) => appt.appointment_date === queueDateString
    );
    setDailyQueueAppointments(daily);
    setDailyQueuePage(1); // Reset to first page when date changes
  }, [dailyQueueDate, appointments]);

  // Calculate pagination for Daily Queue
  const dailyQueuePageCount = Math.ceil(dailyQueueAppointments.length / dailyQueuePageSize);
  const startIndex = (dailyQueuePage - 1) * dailyQueuePageSize;
  const endIndex = startIndex + dailyQueuePageSize;
  const dailyQueuePaginated = dailyQueueAppointments.slice(startIndex, endIndex);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Medical CRM - Secretary Dashboard
          </Typography>
          <SimpleLanguageSwitcher />
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          minHeight: '100vh',
          overflow: 'auto',
          pt: { xs: 6, sm: 8, md: 10 },
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}>
          <Typography variant="h5" gutterBottom>
            {t('welcome')}, {username}
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
                {loading ? (
                  <Typography>Loading appointments...</Typography>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : dailyQueuePaginated.length > 0 ? (
                  <>
                    {dailyQueuePaginated.map((appointment) => (
                      <Paper
                        key={appointment.id}
                        sx={{ p: 2, mb: 2, cursor: 'pointer' }}
                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                      >
                        <Typography variant="subtitle1">
                          <strong>{t('patientRecords') === "Patient Records" ? "Patient:" : t('patientId')}</strong> {appointment.patient_name}
                        </Typography>
                        <Typography variant="body2">
                          <strong>{t('recordDate')}: </strong> {appointment.appointment_date}
                        </Typography>
                        <Typography variant="body2">
                          <strong>{t('time')}: </strong> {appointment.appointment_time}
                        </Typography>
                        <Typography variant="body2">
                          <strong>{t('doctor')}: </strong> {appointment.doctor}
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
            {/* Appointment Scheduling Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: { xs: 'auto', md: 240 } }}>
                <Typography variant="h6" gutterBottom>
                  {t('scheduleAppointments') || 'Schedule Appointments'}
                </Typography>
                <Button variant="contained" component={Link} to="/appointments" sx={{ mt: 2 }}>
                  {t('manageAppointments') || 'Manage Appointments'}
                </Button>
              </Paper>
            </Grid>
            {/* Patient Records Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: { xs: 'auto', md: 240 } }}>
                <Typography variant="h6" gutterBottom>
                  {t('managePatientRecords') || 'Manage Patient Records'}
                </Typography>
                <Button variant="contained" component={Link} to="/patients" sx={{ mt: 2 }}>
                  {t('viewPatientRecords') || 'View Patient Files'}
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

