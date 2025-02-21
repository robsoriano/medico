// src/App.js
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./pages/Login"; // Use your login page from pages
import Dashboard from "./pages/Dashboard"; // Dashboard from pages
import PatientsPage from "./pages/PatientsPage"; // Integrated Patients page from pages
import { getAuthToken } from "./services/authService";
import PatientDetail from "./pages/PatientDetail";
import AppointmentsPage from "./pages/AppointmentsPage";  

// Create a Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// PrivateRoute component to protect routes
const PrivateRoute = ({ element }) => {
  return getAuthToken() ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/patients" element={<PrivateRoute element={<PatientsPage />} />} />
        <Route path="/patients/:id" element={<PrivateRoute element={<PatientDetail />} />} />
        <Route path="/appointments" element={<PrivateRoute element={<AppointmentsPage />} />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
