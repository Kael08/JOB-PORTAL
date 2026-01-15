const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authApi = {
  async sendCode(phone) {
    const response = await fetch(`${API_URL}/auth/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка отправки SMS');
    }

    return response.json();
  },

  async verifyCode(data) {
    console.log('📤 authApi.verifyCode - отправка данных:', data);

    const response = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('📥 authApi.verifyCode - статус ответа:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ authApi.verifyCode - ошибка:', errorText);

      let error;
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        throw new Error('Ошибка сервера: ' + errorText);
      }

      throw new Error(error.message || 'Неверный код');
    }

    const result = await response.json();
    const token = result.access_token || result.accessToken;
    console.log('✅ authApi.verifyCode - успешный ответ:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenField: result.access_token ? 'access_token' : 'accessToken',
      hasUser: !!result.user,
      userName: result.user?.name
    });

    return result;
  },

  async getProfile(token) {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка получения профиля');
    }

    return response.json();
  },
};
