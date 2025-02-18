// src/services/tokenService.js
import { jwtDecode } from 'jwt-decode';

export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role; // Assuming the backend adds "role" to the token payload
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
