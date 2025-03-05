// src/context/SimpleLanguageContext.js
import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    welcome: "Welcome",
    logout: "Logout",
    doctorDashboard: "Doctor Dashboard",
    dailyQueue: "Daily Queue",
    selectDate: "Select Date",
    loadingAppointments: "Loading appointments...",
    failedToFetchAppointments: "Failed to fetch daily appointments.",
    patientId: "Patient ID",
    time: "Time",
    doctor: "Doctor",
    noAppointmentsScheduled: "No appointments scheduled for this day.",
    patientFiles: "Patient Files",
    viewPatientRecords: "View Patient Records",
    calendarView: "Calendar View",
    viewFullCalendar: "View Full Calendar",
    failedToFetchRecords: "Failed to fetch records.",
    loadingRecords: "Loading records...",
    patientRecords: "Patient Records",
    noRecordsFound: "No records found.",
    recordDate: "Record Date",
    doctor: "Doctor",
    notes: "Notes",
    diagnosis: "Diagnosis",
    prescription: "Prescription",
    addRecord: "Add Record",
    email: "Email",
    age: "Age",
    birthDate: "Birth Date",
    homeAddress: "Home Address",
    homePhone: "Home Phone",
    personalPhone: "Personal Phone",
    occupation: "Occupation",
    medicalInsurance: "Medical Insurance",
    backToPatientList: "Back to Patient List",
    editPatient: "Edit Patient",
    deleteRecord: "Delete",
    viewRecord: "View",
    recordDetails: "Record Details",
    close: "Close",
    patientRecords: "Patient Records",
    recordDate: "Record Date",
    doctor: "Doctor",
    notes: "Notes",
    diagnosis: "Diagnosis",
    prescription: "Prescription",
    editRecord: "Edit",
    deleteRecord: "Delete",
    addRecord: "Add Record",
    searchRecords: "Search Records"
  },
  es: {
    welcome: "Bienvenido",
    logout: "Cerrar sesión",
    doctorDashboard: "Panel de Doctor",
    dailyQueue: "Cola Diaria",
    selectDate: "Selecciona Fecha",
    loadingAppointments: "Cargando citas...",
    failedToFetchAppointments: "Error al cargar las citas diarias.",
    patientId: "ID del Paciente",
    time: "Hora",
    doctor: "Doctor",
    noAppointmentsScheduled: "No hay citas programadas para este día.",
    patientFiles: "Expedientes de Pacientes",
    viewPatientRecords: "Ver Expedientes de Pacientes",
    calendarView: "Vista de Calendario",
    viewFullCalendar: "Ver Calendario Completo",
    failedToFetchRecords: "Error al cargar los registros.",
    loadingRecords: "Cargando registros...",
    patientRecords: "Registros del Paciente",
    noRecordsFound: "No se encontraron registros.",
    recordDate: "Fecha del Registro",
    doctor: "Doctor",
    notes: "Notas",
    diagnosis: "Diagnóstico",
    prescription: "Receta",
    addRecord: "Agregar Registro",
    email: "Correo electrónico",
    age: "Edad",
    birthDate: "Fecha de nacimiento",
    homeAddress: "Dirección",
    homePhone: "Teléfono de casa",
    personalPhone: "Teléfono personal",
    occupation: "Ocupación",
    medicalInsurance: "Seguro médico",
    backToPatientList: "Volver a la lista de pacientes",
    editPatient: "Editar paciente",
    deleteRecord: "Eliminar",
    viewRecord: "Ver",
    recordDetails: "Detalles del Registro",
    close: "Cerrar",
    patientRecords: "Registros del Paciente",
    recordDate: "Fecha del Registro",
    doctor: "Doctor",
    notes: "Notas",
    diagnosis: "Diagnóstico",
    prescription: "Receta",
    editRecord: "Editar",
    deleteRecord: "Eliminar",
    addRecord: "Agregar Registro",
    searchRecords: "Buscar Registros"
  }
};

const LanguageContext = createContext();

export const SimpleLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const t = (key) => translations[language][key] || key;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useSimpleLanguage = () => useContext(LanguageContext);
