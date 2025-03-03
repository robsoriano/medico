// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources for English and Spanish
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      dashboard: "Dashboard",
      patients: "Patients",
      appointments: "Appointments",
      logout: "Logout",
      "manage-patients": "Manage Patients",
      "manage-appointments": "Manage Appointments",
      "view-patient-files": "View Patient Files",
      "schedule-appointments": "Schedule Appointments",
      "doctor-dashboard": "Doctor Dashboard",
      "secretary-dashboard": "Secretary Dashboard",
      // ... add more keys as needed
    }
  },
  es: {
    translation: {
      welcome: "Bienvenido",
      dashboard: "Panel de Control",
      patients: "Pacientes",
      appointments: "Citas",
      logout: "Cerrar sesión",
      "manage-patients": "Administrar Pacientes",
      "manage-appointments": "Administrar Citas",
      "view-patient-files": "Ver Expedientes de Pacientes",
      "schedule-appointments": "Programar Citas",
      "doctor-dashboard": "Panel de Doctor",
      "secretary-dashboard": "Panel de Secretaria",
      // ... add more keys as needed
    }
  }
};

i18n
  .use(LanguageDetector) // Automatically detect the user's language
  .use(initReactI18next) // Passes i18n instance to react-i18next.
  .init({
    resources,
    fallbackLng: 'en', // Fallback language if detected language is not available
    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
    detection: {
      // Options for language detection (optional)
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
