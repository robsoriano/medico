// src/components/PatientRecordForm.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { addPatientRecord } from '../services/patientService';
import { useNotification } from '../context/NotificationContext';
import { getUserName } from '../services/tokenService';

const PatientRecordForm = ({ patientId, open, handleClose, onRecordAdded }) => {
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const { showNotification } = useNotification();
  const doctor = getUserName(); // Automatically assign logged-in doctor's name

  const handleSubmit = async () => {
    if (!notes) {
      showNotification("Notes are required", "error");
      return;
    }
    const payload = { 
      notes, 
      diagnosis, 
      prescription, 
      doctor  // Automatically include doctor's name
    };

    // Log payload to check values before submission
    console.log("Submitting payload:", payload);

    try {
      const response = await addPatientRecord(patientId, payload);
      showNotification("Record added successfully", "success");
      onRecordAdded(response.data);
      // Reset form fields
      setNotes('');
      setDiagnosis('');
      setPrescription('');
      handleClose();
    } catch (error) {
      console.error("Error submitting record:", error);
      showNotification("Failed to add record", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Patient Record</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Notes"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Diagnosis"
          type="text"
          fullWidth
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Prescription"
          type="text"
          fullWidth
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save Record</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientRecordForm;
