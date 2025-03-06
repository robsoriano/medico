// src/components/AppointmentForm.js
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, TextField, Button, Autocomplete } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNotification } from '../context/NotificationContext';
import { getPatients } from '../services/patientService';

const AppointmentForm = ({ onSubmit }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [doctor, setDoctor] = useState('');
  const [error, setError] = useState('');
  const { showNotification } = useNotification();

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        setPatients(response.data);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!selectedPatient || !appointmentDate || !appointmentTime || !doctor) {
      setError('All fields are required.');
      showNotification('All fields are required.', 'error');
      return;
    }
    // Format date and time for the backend
    const formattedDate = appointmentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = appointmentTime.toTimeString().split(' ')[0]; // HH:MM:SS

    const payload = {
      patient_id: selectedPatient.id,
      appointment_date: formattedDate,
      appointment_time: formattedTime,
      doctor,
    };

    try {
      onSubmit(payload);
      showNotification('Appointment added successfully!', 'success');
      // Reset form state
      setSelectedPatient(null);
      setAppointmentDate(null);
      setAppointmentTime(null);
      setDoctor('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to add appointment.');
      showNotification('Failed to add appointment.', 'error');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Schedule Appointment
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => `${option.first_name} ${option.last_name} (ID: ${option.id})`}
            onChange={(event, value) => setSelectedPatient(value)}
            value={selectedPatient}
            renderInput={(params) => (
              <TextField {...params} label="Patient" fullWidth margin="normal" required />
            )}
          />
          <DatePicker
            label="Appointment Date"
            value={appointmentDate}
            onChange={(newValue) => setAppointmentDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
          />
          <TimePicker
            label="Appointment Time"
            value={appointmentTime}
            onChange={(newValue) => setAppointmentTime(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
          />
          <TextField
            label="Doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
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
      </LocalizationProvider>
    </Paper>
  );
};

export default AppointmentForm;
