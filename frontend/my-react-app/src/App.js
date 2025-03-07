// src/App.js
import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./pages/Login"; // Use your login page from pages
import Dashboard from "./pages/Dashboard"; // Dashboard from pages
import PatientsPage from "./pages/PatientsPage"; // Integrated Patients page from pages
import { getAuthToken } from "./services/authService";
import PatientDetail from "./pages/PatientDetail";
import PatientEdit from "./pages/PatientEdit"; // Newly created edit page
import AppointmentsPage from "./pages/AppointmentsPage";  
import CalendarView from "./components/CalendarView"; // Directly using CalendarView.js
import AppointmentDetail from "./pages/AppointmentDetail"; // New: AppointmentDetail from components
import { NotificationProvider } from "./context/NotificationContext";
import { SimpleLanguageProvider } from "./context/SimpleLanguageContext";
import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AppointmentPage from "./pages/AppointmentDetail";

// PrivateRoute component to protect routes
const PrivateRoute = ({ element }) => {
  return getAuthToken() ? element : <Navigate to="/login" />;
};

function App() {
  // State for dark mode toggle
  const [darkMode, setDarkMode] = useState(false);

  // Create a theme with enhanced typography, spacing, and component overrides
  const appliedTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h5: {
        fontWeight: 600,
      },
      body1: {
        fontSize: "1rem",
      },
    },
    spacing: 8, // Default spacing factor
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            padding: 16,
          },
        },
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <SimpleLanguageProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/patients" element={<PrivateRoute element={<PatientsPage />} />} />
            <Route path="/patients/:id" element={<PrivateRoute element={<PatientDetail />} />} />
            <Route path="/patients/:id/edit" element={<PrivateRoute element={<PatientEdit />} />} />
            <Route path="/appointments" element={<PrivateRoute element={<AppointmentsPage />} />} />
            <Route path="/appointments/calendar" element={<PrivateRoute element={<CalendarView />} />} />
            {/* New AppointmentDetail route */}
            <Route path="/appointments/:id" element={<PrivateRoute element={<AppointmentDetail />} />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/appointments/:id" element={<PrivateRoute element={<AppointmentPage />} />} />
          </Routes>
          {/* Dark Mode Toggle Button */}
          <IconButton
            onClick={toggleDarkMode}
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            color="inherit"
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </NotificationProvider>
      </SimpleLanguageProvider>
    </ThemeProvider>
  );
}

export default App;
