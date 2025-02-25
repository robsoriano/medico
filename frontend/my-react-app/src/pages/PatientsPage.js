// src/pages/PatientsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Typography, Paper, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PatientList from '../pages/PatientList';
import { getPatients, addPatient } from '../services/patientService';

const PatientsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Updated form data with new fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    age: '',
    birth_date: '',
    home_address: '',
    home_phone: '',
    personal_phone: '',
    occupation: '',
    medical_insurance: ''
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients based on search query (first + last name, and email)
  useEffect(() => {
    if (!searchQuery) {
      setFilteredPatients(patients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = patients.filter((patient) => {
        // Combine first and last name for search
        const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
        return (
          fullName.includes(query) ||
          patient.email.toLowerCase().includes(query)
        );
      });
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Validate required fields: first name, last name, and email
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError('First name, Last name, and Email are required.');
      return;
    }
    // Prepare payload; convert age to integer if provided
    const payload = {
      ...formData,
      age: formData.age ? parseInt(formData.age, 10) : null,
      birth_date: formData.birth_date || null,
      home_address: formData.home_address || null,
      home_phone: formData.home_phone || null,
      personal_phone: formData.personal_phone || null,
      occupation: formData.occupation || null,
      medical_insurance: formData.medical_insurance || null
    };

    try {
      const response = await addPatient(payload);
      // Update the patients list with the new patient
      setPatients([...patients, response.data]);
      // Clear the form and switch back to the list view
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        age: '',
        birth_date: '',
        home_address: '',
        home_phone: '',
        personal_phone: '',
        occupation: '',
        medical_insurance: ''
      });
      setTabValue(0);
    } catch (err) {
      console.error(err);
      setError('Failed to add patient.');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* Back to Dashboard Button */}
      <Button variant="outlined" component={Link} to="/dashboard" sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="Patient management tabs">
        <Tab label="Patient List" />
        <Tab label="Add Patient" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && (
          <>
            <TextField
              label="Search Patients"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />
            {loading ? (
              <Typography>Loading patients...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <PatientList patients={filteredPatients} setPatients={setPatients} />
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
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
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
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Birth Date"
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Home Address"
                name="home_address"
                value={formData.home_address}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Home Phone"
                name="home_phone"
                value={formData.home_phone}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Personal Phone"
                name="personal_phone"
                value={formData.personal_phone}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Medical Insurance"
                name="medical_insurance"
                value={formData.medical_insurance}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
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
