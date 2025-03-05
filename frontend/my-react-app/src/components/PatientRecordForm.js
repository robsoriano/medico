// src/components/PatientRecordForm.js
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { addPatientRecord, updatePatientRecord } from '../services/patientService';
import { useNotification } from '../context/NotificationContext';
import { getUserName } from '../services/tokenService';

const PatientRecordForm = ({ patientId, open, handleClose, onRecordAdded, initialRecord }) => {
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const { showNotification } = useNotification();
  const doctor = getUserName(); // Automatically assign the logged-in doctor's name

  // If in edit mode, prepopulate fields
  useEffect(() => {
    if (initialRecord) {
      setNotes(initialRecord.notes || '');
      setDiagnosis(initialRecord.diagnosis || '');
      setPrescription(initialRecord.prescription || '');
    } else {
      // Reset fields for add mode
      setNotes('');
      setDiagnosis('');
      setPrescription('');
    }
  }, [initialRecord]);

  const handleSubmit = async () => {
    if (!notes) {
      showNotification("Notes are required", "error");
      return;
    }
    const payload = { 
      notes: notes.trim(), 
      diagnosis: diagnosis.trim() || null, 
      prescription: prescription.trim() || null, 
      doctor // Automatically include the doctor's name
    };

    console.log("Submitting payload:", payload);
    try {
      if (initialRecord) {
        // Edit mode: update the record
        const response = await updatePatientRecord(patientId, initialRecord.id, payload);
        showNotification("Record updated successfully", "success");
        onRecordAdded(response.data); // Optionally update the list (or re-fetch)
      } else {
        // Add mode: create a new record
        const response = await addPatientRecord(patientId, payload);
        showNotification("Record added successfully", "success");
        onRecordAdded(response.data);
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting record:", error);
      showNotification("Failed to save record", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{initialRecord ? "Edit Patient Record" : "Add New Patient Record"}</DialogTitle>
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
        <Button onClick={handleSubmit} variant="contained">
          {initialRecord ? "Update Record" : "Save Record"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientRecordForm;
