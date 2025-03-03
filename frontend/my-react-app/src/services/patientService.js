// src/services/patientService.js
import API from './api';

export const getPatients = () =>
API.get('/patients', { params: { t: new Date().getTime() } });

export const addPatient = (patientData) => API.post('/patients', patientData);

export const updatePatient = (id, patientData) => API.put(`/patients/${id}`, patientData);

export const deletePatient = (id) => API.delete(`/patients/${id}`);

export const getPatient = (id) => {
    return API.get(`/patients/${id}`);}

// NEW: Function to get patient records
export const getPatientRecords = (patientId) => API.get(`/patients/${patientId}/records`);
export const addPatientRecord = (patientId, recordData) =>
    API.post(`/patients/${patientId}/records`, recordData);
