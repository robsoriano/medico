import API from './api';

// ✅ Ensure `login` function exists
export const login = async (username, password) => {
  try {
    const response = await API.post('/login', { username, password });
    const { access_token, refresh_token } = response.data;

    localStorage.setItem('token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    return { success: true };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || 'Login failed' };
  }
};

// ✅ Fix: Re-add `getAuthToken` function
export const getAuthToken = () => {
  return localStorage.getItem('token'); // Retrieve JWT token from storage
};

// ✅ Ensure `refreshToken` function exists
export const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) return null;

    const response = await API.post('/refresh', {}, {
      headers: { Authorization: `Bearer ${refresh_token}` }
    });

    const newToken = response.data.access_token;
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
};
