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
    addRecord: "Add Record"
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
    addRecord: "Agregar Registro"
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
