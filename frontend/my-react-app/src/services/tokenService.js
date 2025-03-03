// src/services/tokenService.js
import { jwtDecode } from 'jwt-decode';


export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role; // Assuming your token payload includes a "role" field
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
export const getUserName = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      // Usually, the identity is stored in "sub" (subject) or another claim.
      return decoded.sub || decoded.identity || "User";
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  }
  return "User";
};
