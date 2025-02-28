// src/services/tokenService.js
import jwt_decode from 'jwt-decode';

export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwt_decode(token);
      return decoded.role; // Extract role from token payload
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  }
  return null;
};

export const getUserName = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwt_decode(token);
      // Usually, the identity is stored in "sub" (subject) or another claim.
      return decoded.sub || decoded.identity || "User";
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  }
  return "User";
};
