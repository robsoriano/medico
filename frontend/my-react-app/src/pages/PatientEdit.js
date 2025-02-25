// src/pages/PatientEdit.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, TextField, Button, Box, Stack } from "@mui/material";
import { getPatient, updatePatient } from "../services/patientService";

const PatientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    birth_date: "",
    home_address: "",
    home_phone: "",
    personal_phone: "",
    occupation: "",
    medical_insurance: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch patient data on mount
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatient(id);
        const patient = response.data;
        // Pre-fill the form with existing patient details
        setPatientData({
          first_name: patient.first_name || "",
          last_name: patient.last_name || "",
          email: patient.email || "",
          age: patient.age || "",
          birth_date: patient.birth_date || "",
          home_address: patient.home_address || "",
          home_phone: patient.home_phone || "",
          personal_phone: patient.personal_phone || "",
          occupation: patient.occupation || "",
          medical_insurance: patient.medical_insurance || ""
        });
      } catch (err) {
        console.error("Error fetching patient:", err);
        setError("Failed to load patient details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validate required fields
    if (!patientData.first_name || !patientData.last_name || !patientData.email) {
      setError("First name, Last name, and Email are required.");
      return;
    }
    try {
      await updatePatient(id, patientData);
      // Navigate back to the patient detail page after update
      navigate(`/patients/${id}`);
    } catch (err) {
      console.error("Error updating patient:", err);
      setError("Failed to update patient.");
    }
  };

  if (loading) return <Typography>Loading patient details...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Patient
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="First Name"
              name="first_name"
              value={patientData.first_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={patientData.last_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={patientData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={patientData.age}
              onChange={handleChange}
            />
            <TextField
              label="Birth Date"
              name="birth_date"
              type="date"
              value={patientData.birth_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Home Address"
              name="home_address"
              value={patientData.home_address}
              onChange={handleChange}
            />
            <TextField
              label="Home Phone"
              name="home_phone"
              value={patientData.home_phone}
              onChange={handleChange}
            />
            <TextField
              label="Personal Phone"
              name="personal_phone"
              value={patientData.personal_phone}
              onChange={handleChange}
            />
            <TextField
              label="Occupation"
              name="occupation"
              value={patientData.occupation}
              onChange={handleChange}
            />
            <TextField
              label="Medical Insurance"
              name="medical_insurance"
              value={patientData.medical_insurance}
              onChange={handleChange}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Stack direction="row" spacing={2}>
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
              <Button variant="outlined" onClick={() => navigate(`/patients/${id}`)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientEdit;
