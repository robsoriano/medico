// src/pages/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, Grid, Paper, Button, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { logout } from '../services/authService';
import { getAppointments } from '../services/appointmentService';
import { getUserName } from '../services/tokenService';
import CurrentTime from '../components/CurrentTime';
import SimpleLanguageSwitcher from '../components/SimpleLanguageSwitcher';
import { useSimpleLanguage } from '../context/SimpleLanguageContext';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const username = getUserName();
  const { t } = useSimpleLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [dailyQueueDate, setDailyQueueDate] = useState(new Date());
  const [dailyQueueAppointments, setDailyQueueAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');

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
        setAppointmentsError(t('failedToFetchAppointments'));
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchDailyAppointments();
  }, [dailyQueueDate, t]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('doctorDashboard')}
          </Typography>
          <SimpleLanguageSwitcher />
          <Button color="inherit" onClick={handleLogout}>
            {t('logout')}
          </Button>
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
            <Grid item xs={12}>
              <Paper sx={{ p: 2, height: { xs: 'auto', md: 240 } }}>
                <Typography variant="h6" gutterBottom>
                  {t('dailyQueue')}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('selectDate')}
                    value={dailyQueueDate}
                    onChange={(newValue) => newValue && setDailyQueueDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </LocalizationProvider>
                {loadingAppointments ? (
                  <Typography>{t('loadingAppointments')}</Typography>
                ) : appointmentsError ? (
                  <Typography color="error">{appointmentsError}</Typography>
                ) : dailyQueueAppointments.length > 0 ? (
                  dailyQueueAppointments.map((appointment) => (
                    <Box key={appointment.id} sx={{ mt: 1, mb: 1, borderBottom: '1px solid #ccc', pb: 1 }}>
                      <Typography>
                        <strong>{t('patientId')}:</strong> {appointment.patient_id}
                      </Typography>
                      <Typography>
                        <strong>{t('time')}:</strong> {appointment.appointment_time}
                      </Typography>
                      <Typography>
                        <strong>{t('doctor')}:</strong> {appointment.doctor}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography>{t('noAppointmentsScheduled')}</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: { xs: 'auto', md: 240 } }}>
                <Typography variant="h6" gutterBottom>
                  {t('patientFiles')}
                </Typography>
                <Button variant="contained" component={Link} to="/patients" sx={{ mt: 2 }}>
                  {t('viewPatientRecords')}
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, height: { xs: 'auto', md: 240 } }}>
                <Typography variant="h6" gutterBottom>
                  {t('calendarView')}
                </Typography>
                <Button variant="contained" component={Link} to="/appointments/calendar" sx={{ mt: 2 }}>
                  {t('viewFullCalendar')}
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
