// src/pages/PatientDetail.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Button, Box, Modal } from "@mui/material";
import { getPatient } from "../services/patientService";
import { addAppointment } from "../services/appointmentService";
import PatientRecords from "../components/PatientRecords";
import AppointmentForm from "../components/AppointmentForm";
import UpcomingAppointments from "../components/UpcomingAppointments";
import { useSimpleLanguage } from "../context/SimpleLanguageContext";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useSimpleLanguage();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatient(id);
        setPatient(response.data);
      } catch (err) {
        console.error("Error fetching patient:", err);
        setError(t("failedToLoadPatient") || "Failed to load patient details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, t]);

  const handleAppointmentSubmit = async (appointmentData) => {
    try {
      await addAppointment(appointmentData);
      console.log("Appointment successfully added");
      setShowAppointmentForm(false);
      // Optionally, refresh appointments data here if needed.
    } catch (error) {
      console.error("Error adding appointment:", error);
      // Optionally, display an error notification.
    }
  };

  if (loading) return <Typography>{t("loadingPatient") || "Loading patient details..."}</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!patient) return <Typography>{t("patientNotFound") || "Patient not found."}</Typography>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {patient.first_name} {patient.last_name}
        </Typography>
        <Typography variant="body1">
          <strong>{t("email")}:</strong> {patient.email}
        </Typography>
        <Typography variant="body1">
          <strong>{t("age")}:</strong> {patient.age || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>{t("birthDate")}:</strong> {patient.birth_date || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>{t("homeAddress")}:</strong> {patient.home_address || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>{t("homePhone")}:</strong> {patient.home_phone || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>{t("personalPhone")}:</strong> {patient.personal_phone || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>{t("occupation")}:</strong> {patient.occupation || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>{t("medicalInsurance")}:</strong> {patient.medical_insurance || "N/A"}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => navigate("/patients")}>
            {t("backToPatientList") || "Back to Patient List"}
          </Button>
          <Button variant="outlined" onClick={() => navigate(`/patients/${id}/edit`)} sx={{ ml: 2 }}>
            {t("editPatient") || "Edit Patient"}
          </Button>
          <Button variant="contained" onClick={() => setShowAppointmentForm(true)} sx={{ ml: 2 }}>
            {t("scheduleAppointment") || "Schedule Appointment"}
          </Button>
        </Box>
      </Paper>

      {/* Patient Records Section */}
      <Box sx={{ mt: 4 }}>
        <PatientRecords patientId={id} />
      </Box>

      {/* Upcoming Appointments Section */}
      <Box sx={{ mt: 4 }}>
        <UpcomingAppointments patientId={patient.id} />
      </Box>

      {/* Modal for scheduling appointment */}
      <Modal
        open={showAppointmentForm}
        onClose={() => setShowAppointmentForm(false)}
        aria-labelledby="schedule-appointment-modal"
      >
        <Box sx={modalStyle}>
          <Typography id="schedule-appointment-modal" variant="h6" gutterBottom>
            {t("scheduleAppointment")} - {patient.first_name} {patient.last_name}
          </Typography>
          <AppointmentForm onSubmit={handleAppointmentSubmit} defaultPatient={patient} />
        </Box>
      </Modal>
    </Container>
  );
};

export default PatientDetail;
