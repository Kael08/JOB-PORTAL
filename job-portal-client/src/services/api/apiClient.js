/**
 * Утилита для API запросов с автоматическим добавлением токена
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Получить токен из localStorage
 */
const getToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Универсальный API клиент с поддержкой авторизации
 */
export const apiClient = {
  /**
   * POST запрос с авторизацией
   * @param {string} endpoint - путь эндпоинта (например, '/post-job')
   * @param {object} data - данные для отправки
   * @returns {Promise<any>}
   */
  async post(endpoint, data) {
    const token = getToken();

    console.log('🔐 API Client - Token:', token ? `${token.substring(0, 20)}...` : 'ОТСУТСТВУЕТ');

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.error('❌ Токен не найден в localStorage!');
    }

    console.log('📤 Отправка запроса:', `${API_URL}${endpoint}`);

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    console.log('📥 Статус ответа:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка сервера' }));
      console.error('❌ Ошибка ответа:', error);
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },

  /**
   * GET запрос с авторизацией
   * @param {string} endpoint - путь эндпоинта
   * @returns {Promise<any>}
   */
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

  /**
   * PATCH запрос с авторизацией
   * @param {string} endpoint - путь эндпоинта
   * @param {object} data - данные для отправки
   * @returns {Promise<any>}
   */
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

  /**
   * DELETE запрос с авторизацией
   * @param {string} endpoint - путь эндпоинта
   * @returns {Promise<any>}
   */
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
