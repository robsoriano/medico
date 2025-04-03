// src/components/UpcomingAppointments.js
import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAppointments } from '../services/appointmentService';

const UpcomingAppointments = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await getAppointments();
        // Filter appointments for the given patient and only those on or after today
        const today = new Date().toISOString().split('T')[0];
        const patientAppointments = response.data.filter(
          (appt) =>
            appt.patient_id === patientId &&
            appt.appointment_date >= today
        );
        setAppointments(patientAppointments);
      } catch (err) {
        setError('Failed to fetch appointments.');
      }
      setLoading(false);
    };

    fetchAppointments();
  }, [patientId]);

  if (loading) return <Typography>Loading appointments...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (appointments.length === 0) return <Typography>No upcoming appointments.</Typography>;

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Upcoming Appointments</Typography>
      {appointments.map((appt) => (
        <Link 
          key={appt.id} 
          to={`/appointments/${appt.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Box sx={{ mt: 1, mb: 1, borderBottom: '1px solid #ccc', pb: 1, cursor: 'pointer' }}>
            <Typography variant="body2">
              <strong>Date:</strong> {appt.appointment_date}
            </Typography>
            <Typography variant="body2">
              <strong>Time:</strong> {appt.appointment_time}
            </Typography>
            <Typography variant="body2">
              <strong>Doctor:</strong> {appt.doctor}
            </Typography>
          </Box>
        </Link>
      ))}
    </Paper>
  );
};

export default UpcomingAppointments;
