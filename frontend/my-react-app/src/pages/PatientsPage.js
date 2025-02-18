// src/pages/PatientsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Paper, Typography, TextField, Button } from '@mui/material';
import PatientList from '../pages/PatientList';
import { getPatients, addPatient } from '../services/patientService';

const PatientsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await getPatients();
      setPatients([...response.data]); // Force a new array instance
      setLoading(false);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError('Failed to fetch patients.');
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
      const response = await addPatient(formData);
      // Update the patient list with the new patient
      setPatients([...patients, response.data]);
      setFormData({ name: '', email: '', phone: '' });
      setTabValue(0); // Switch back to the list view
    } catch (err) {
      console.error(err);
      setError('Failed to add patient.');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="Patient management tabs">
        <Tab label="Patient List" />
        <Tab label="Add Patient" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && (
          <>
            {loading ? (
              <Typography>Loading patients...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <PatientList patients={patients} setPatients={setPatients} />
            )}
          </>
        )}
        {tabValue === 1 && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Patient
            </Typography>
            <Box component="form" onSubmit={handleFormSubmit} noValidate>
              <TextField
                label="Patient Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
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
                Save Patient
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default PatientsPage;
