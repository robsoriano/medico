// src/pages/AppointmentsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Typography, Paper, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppointmentForm from '../components/AppointmentForm';
import CalendarView from '../components/CalendarView';
import { getAppointments, addAppointment } from '../services/appointmentService';
import { Link } from 'react-router-dom';

const AppointmentsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states for Appointment List tab
  const [filterDate, setFilterDate] = useState(null);
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterPatient, setFilterPatient] = useState('');
  
  // Daily Queue state with default set to current day
  const [dailyQueueDate, setDailyQueueDate] = useState(new Date());
  const [dailyQueueAppointments, setDailyQueueAppointments] = useState([]);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments for Appointment List tab
  useEffect(() => {
    let filtered = [...appointments];

    if (filterDate) {
      const filterDateString = filterDate.toISOString().split('T')[0]; // YYYY-MM-DD
      filtered = filtered.filter(a => a.appointment_date === filterDateString);
    }

    if (filterDoctor.trim()) {
      filtered = filtered.filter(a => 
        a.doctor.toLowerCase().includes(filterDoctor.trim().toLowerCase())
      );
    }

    if (filterPatient.trim()) {
      // Assuming filterPatient can be used to match patient name (or part of it)
      filtered = filtered.filter(a => 
        a.patient_name && a.patient_name.toLowerCase().includes(filterPatient.trim().toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  }, [filterDate, filterDoctor, filterPatient, appointments]);

  // Filter appointments for Daily Queue tab when dailyQueueDate changes or appointments update
  useEffect(() => {
    const queueDateString = dailyQueueDate.toISOString().split('T')[0];
    const dailyAppointments = appointments.filter(a => a.appointment_date === queueDateString);
    setDailyQueueAppointments(dailyAppointments);
  }, [dailyQueueDate, appointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAppointments();
      setAppointments([...response.data]); // Force a new array instance
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError('Failed to fetch appointments.');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleAppointmentSubmit = async (appointmentData) => {
    try {
      const response = await addAppointment(appointmentData);
      setAppointments([...appointments, response.data]);
      setTabValue(0);
    } catch (err) {
      console.error(err);
      setError('Failed to add appointment.');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* Back to Dashboard Button */}
      <Button variant="outlined" component={Link} to="/dashboard" sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="Appointment management tabs">
        <Tab label="Appointment List" />
        <Tab label="Add Appointment" />
        <Tab label="Calendar View" />
        <Tab label="Daily Queue" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Filter by Date"
                value={filterDate}
                onChange={(newValue) => setFilterDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>
            <TextField
              label="Filter by Doctor"
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Filter by Patient Name"
              value={filterPatient}
              onChange={(e) => setFilterPatient(e.target.value)}
              fullWidth
              margin="normal"
            />
            {loading ? (
              <Typography>Loading appointments...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Appointment List
                </Typography>
                {filteredAppointments.map((appointment) => (
                  <Box key={appointment.id} sx={{ mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
                    <Typography>
                      <strong>Patient:</strong> {appointment.patient_name}
                    </Typography>
                    <Typography>
                      <strong>Date:</strong> {appointment.appointment_date}
                    </Typography>
                    <Typography>
                      <strong>Time:</strong> {appointment.appointment_time}
                    </Typography>
                    <Typography>
                      <strong>Doctor:</strong> {appointment.doctor}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </>
        )}
        {tabValue === 1 && (
          <AppointmentForm onSubmit={handleAppointmentSubmit} />
        )}
        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Appointment Calendar
            </Typography>
            <CalendarView />
          </Box>
        )}
        {tabValue === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Daily Queue
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Day"
                value={dailyQueueDate}
                onChange={(newValue) => setDailyQueueDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>
            {dailyQueueAppointments.length > 0 ? (
              <Paper sx={{ p: 2 }}>
                {dailyQueueAppointments.map((appointment) => (
                  <Box key={appointment.id} sx={{ mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
                    <Typography>
                      <strong>Patient:</strong> {appointment.patient_name}
                    </Typography>
                    <Typography>
                      <strong>Date:</strong> {appointment.appointment_date}
                    </Typography>
                    <Typography>
                      <strong>Time:</strong> {appointment.appointment_time}
                    </Typography>
                    <Typography>
                      <strong>Doctor:</strong> {appointment.doctor}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            ) : (
              <Typography>No appointments scheduled for this day.</Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AppointmentsPage;
