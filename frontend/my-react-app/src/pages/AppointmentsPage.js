
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Tabs, Tab } from '@mui/material';
import { getAppointments, addAppointment } from '../services/appointmentService';

const AppointmentsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_date: '',
    appointment_time: '',
    doctor: '',
  });

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

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await addAppointment(formData);
      setAppointments([...appointments, response.data]);
      setFormData({
        patient_id: '',
        appointment_date: '',
        appointment_time: '',
        doctor: '',
      });
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
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Appointment
            </Typography>
            <Box component="form" onSubmit={handleFormSubmit} noValidate>
              <TextField
                label="Patient ID"
                name="patient_id"
                value={formData.patient_id}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Appointment Date (YYYY-MM-DD)"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Appointment Time (HH:MM:SS)"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                required
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Save Appointment
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default AppointmentsPage;
