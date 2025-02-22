// src/pages/AppointmentsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import AppointmentForm from '../components/AppointmentForm';
import { getAppointments, addAppointment } from '../services/appointmentService';

const AppointmentsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAppointments();
      setAppointments([...response.data]);
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
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="Appointment management tabs">
        <Tab label="Appointment List" />
        <Tab label="Add Appointment" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && (
          <>
            {loading ? (
              <Typography>Loading appointments...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Appointment List
                </Typography>
                {appointments.map((appointment) => (
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

