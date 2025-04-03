// src/services/appointmentService.js
import API from './api';

export const getAppointments = () => {
  return API.get('/appointments');
};

export const addAppointment = (appointmentData) => {
  return API.post('/appointments', appointmentData);
};

export const getAppointment = (id) => API.get(`/appointments/${id}`);

export const deleteAppointment = (id) => {
  return API.delete(`/appointments/${id}`);
};
