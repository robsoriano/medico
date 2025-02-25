// src/pages/PatientDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Button, Box } from "@mui/material";
import { getPatient } from "../services/patientService";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        setError("Failed to load patient details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <Typography>Loading patient details...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!patient) return <Typography>No patient found.</Typography>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {patient.first_name} {patient.last_name}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {patient.email}
        </Typography>
        <Typography variant="body1">
          <strong>Age:</strong> {patient.age || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Birth Date:</strong> {patient.birth_date || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Home Address:</strong> {patient.home_address || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Home Phone:</strong> {patient.home_phone || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Personal Phone:</strong> {patient.personal_phone || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Occupation:</strong> {patient.occupation || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Medical Insurance:</strong> {patient.medical_insurance || "N/A"}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => navigate("/patients")}>
            Back to Patient List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientDetail;
