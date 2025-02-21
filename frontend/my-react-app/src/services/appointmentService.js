// src/services/appointmentService.js
import API from './api';

export const getAppointments = () => {
  return API.get('/appointments');
};

export const addAppointment = (appointmentData) => {
  return API.post('/appointments', appointmentData);
};

// You can later add update and delete functions as needed
