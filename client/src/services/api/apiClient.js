const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getToken = () => {
  return localStorage.getItem('auth_token');
};

export const apiClient = {
  async post(endpoint, data) {
    const token = getToken();

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка сервера' }));
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },

  async get(endpoint) {
    const token = getToken();

    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },

  async patch(endpoint, data) {
    const token = getToken();

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },

  async delete(endpoint) {
    const token = getToken();

    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },
};
