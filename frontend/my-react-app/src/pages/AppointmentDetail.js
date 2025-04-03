// src/components/AppointmentDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
import { getAppointment, deleteAppointment } from '../services/appointmentService';
import { getPatient } from '../services/patientService';
import { useSimpleLanguage } from '../context/SimpleLanguageContext';

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useSimpleLanguage();
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointment details
        const appointmentRes = await getAppointment(id);
        setAppointment(appointmentRes.data);
        // Fetch the corresponding patient details using patient_id from the appointment
        if (appointmentRes.data && appointmentRes.data.patient_id) {
          const patientRes = await getPatient(appointmentRes.data.patient_id);
          setPatient(patientRes.data);
        }
      } catch (err) {
        setError(t('failedToFetchAppointments') || 'Failed to fetch appointment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  const handleDelete = async () => {
    if (window.confirm(t('confirmDeletionMessage') || "Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(appointment.id);
        // Navigate back to the PatientDetail page with the upcoming appointments tab active (tab=1)
        navigate(`/patients/${patient.id}?tab=1`);
      } catch (err) {
        console.error("Error deleting appointment:", err);
        setError(t('failedToDeleteAppointment') || "Failed to delete appointment.");
      }
    }
  };

  if (loading) return <Typography>{t('loadingAppointments') || "Loading appointment details..."}</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!appointment) return <Typography>{t('appointmentNotFound') || "Appointment not found."}</Typography>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('appointmentDetails') || "Appointment Details"}
        </Typography>
        <Typography variant="body1">
          <strong>{t('recordDate') || "Date"}:</strong> {appointment.appointment_date}
        </Typography>
        <Typography variant="body1">
          <strong>{t('time') || "Time"}:</strong> {appointment.appointment_time}
        </Typography>
        <Typography variant="body1">
          <strong>{t('doctor')}:</strong> {appointment.doctor}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            {t('patientDetails') || "Patient Details"}
          </Typography>
          {patient ? (
            <>
              <Typography variant="body1">
                <strong>{t('editPatient') || "Name"}:</strong> {patient.first_name} {patient.last_name}
              </Typography>
              <Typography variant="body1">
                <strong>{t('email') || "Email"}:</strong> {patient.email}
              </Typography>
              <Typography variant="body1">
                <strong>{t('homePhone') || "Home Phone"}:</strong> {patient.home_phone || "N/A"}
              </Typography>
              <Button variant="contained" component={Link} to={`/patients/${patient.id}`}>
                {t('viewPatientRecords') || "View Full Patient Record"}
              </Button>
            </>
          ) : (
            <Typography>{t('noPatientDetails') || "No patient details available."}</Typography>
          )}
        </Box>

        {/* Buttons for navigating, editing, and deleting the appointment */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            {t('back') || "Back"}
          </Button>
          <Button variant="contained" onClick={() => navigate(`/appointments/${appointment.id}/edit`)}>
            {t('editAppointment') || "Edit Appointment"}
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            {t('deleteAppointment') || "Delete Appointment"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AppointmentDetail;
