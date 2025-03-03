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
