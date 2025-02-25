// src/pages/AppointmentsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Typography, Paper, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppointmentForm from '../components/AppointmentForm';
import { getAppointments, addAppointment } from '../services/appointmentService';
import { Link } from 'react-router-dom';

const AppointmentsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New filter states
  const [filterDate, setFilterDate] = useState(null);
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterPatient, setFilterPatient] = useState('');

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments based on selected filters
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
      filtered = filtered.filter(a => 
        a.patient_id.toString().includes(filterPatient.trim())
      );
    }

    setFilteredAppointments(filtered);
  }, [filterDate, filterDoctor, filterPatient, appointments]);

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
              label="Filter by Patient ID"
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
                      <strong>Patient ID:</strong> {appointment.patient_id}
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
      </Box>
    </Container>
  );
};

export default AppointmentsPage;
