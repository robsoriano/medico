// src/pages/SecretaryDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, Grid, Paper, Button, TextField } from '@mui/material';
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

  // Daily Queue state
  const [dailyQueueDate, setDailyQueueDate] = useState(new Date());
  const [dailyQueueAppointments, setDailyQueueAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');

  const fetchDailyAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await getAppointments();
      const selectedDate = dailyQueueDate.toISOString().split('T')[0];
      const daily = response.data.filter(
        (appointment) => appointment.appointment_date === selectedDate
      );
      setDailyQueueAppointments(daily);
      setAppointmentsError('');
    } catch (error) {
      setAppointmentsError(t('failedToFetchAppointments') || 'Failed to fetch appointments.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchDailyAppointments();
  }, [dailyQueueDate, t]);

  return (
    <Box sx={{ display: "flex" }}>
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
            theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          minHeight: "100vh",
          overflow: "auto",
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
              <Paper sx={{ p: 2, height: { xs: 'auto', md: 240 } }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('selectDate')}
                    value={dailyQueueDate}
                    onChange={(newValue) => newValue && setDailyQueueDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </LocalizationProvider>
                <Typography variant="h6" gutterBottom>
                  {t('dailyQueue')}
                </Typography>
                {loadingAppointments ? (
                  <Typography>{t('loadingAppointments')}</Typography>
                ) : appointmentsError ? (
                  <Typography color="error">{appointmentsError}</Typography>
                ) : dailyQueueAppointments.length > 0 ? (
                  dailyQueueAppointments.map((appointment) => (
                    <Paper key={appointment.id} sx={{ p: 1, mb: 1 }}>
                      <Typography variant="body2">
                        {t('patientId')}: {appointment.patient_id}
                      </Typography>
                      <Typography variant="body2">
                        {t('appointmentTime')}: {appointment.appointment_time}
                      </Typography>
                      <Typography variant="body2">
                        {t('doctor')}: {appointment.doctor}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography>{t('noAppointmentsScheduled')}</Typography>
                )}
              </Paper>
            </Grid>
            {/* Appointment Scheduling Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: { xs: 2, md: 3 }, height: { xs: 'auto', md: 240 } }}>
                <Typography variant="h6" gutterBottom>
                  {t('scheduleAppointments') || "Schedule Appointments"}
                </Typography>
                <Button variant="contained" component={Link} to="/appointments" sx={{ mt: 2 }}>
                  {t('manageAppointments') || "Manage Appointments"}
                </Button>
              </Paper>
            </Grid>
            {/* Patient Records Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: { xs: 2, md: 3 }, height: { xs: 'auto', md: 240 } }}>
                <Typography variant="h6" gutterBottom>
                  {t('managePatientRecords') || "Manage Patient Records"}
                </Typography>
                <Button variant="contained" component={Link} to="/patients" sx={{ mt: 2 }}>
                  {t('viewPatientRecords') || "View Patient Files"}
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
