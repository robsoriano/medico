// src/services/patientService.js
import API from './api';

export const getPatients = () =>
API.get('/patients', { params: { t: new Date().getTime() } });

export const addPatient = (patientData) => API.post('/patients', patientData);

export const updatePatient = (id, patientData) => API.put(`/patients/${id}`, patientData);

export const deletePatient = (id) => API.delete(`/patients/${id}`);