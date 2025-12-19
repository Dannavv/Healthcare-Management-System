import { useAuth } from './authContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useAuthService = () => {
  const { login, logout } = useAuth();

  const register = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register');
    }

    return response.json();
  };

  const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
    }

    const data = await response.json();
    login(data);
    return data;
  };

  const logoutUser = () => {
    logout();
  };

  return {
    register,
    loginUser,
    logoutUser,
  };
};
