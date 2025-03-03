// src/pages/PatientDetail.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Button, Box } from "@mui/material";
import { getPatient } from "../services/patientService";
import PatientRecords from "../components/PatientRecords";
import { useSimpleLanguage } from "../context/SimpleLanguageContext";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useSimpleLanguage();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        </Box>
      </Paper>

      {/* Patient Records Section */}
      <Box sx={{ mt: 4 }}>
        <PatientRecords patientId={id} />
      </Box>
    </Container>
  );
};

export default PatientDetail;

