import config from '../config';

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);  // OAuth2 expects 'username' field
  formData.append('password', password);

  const response = await fetch(`${config.API_BASE_URL}/api/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

export const register = async (email, password) => {
  const response = await fetch(`${config.API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
}; 