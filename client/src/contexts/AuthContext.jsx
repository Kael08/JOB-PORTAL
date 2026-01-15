import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../services/api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthContext: Загрузка данных из localStorage...');
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    console.log('📦 Из localStorage:', {
      token: storedToken ? `${storedToken.substring(0, 20)}...` : 'ОТСУТСТВУЕТ',
      user: storedUser ? JSON.parse(storedUser).name : 'ОТСУТСТВУЕТ'
    });

    if (storedToken && storedUser && storedToken !== 'undefined' && storedToken !== 'null') {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      console.log('✅ Данные загружены из localStorage');
    } else {
      console.log('⚠️ Токен или пользователь отсутствуют/невалидны в localStorage');
      if (storedToken === 'undefined' || storedToken === 'null') {
        console.log('🗑️ Очистка невалидных данных...');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (phone, code, name, role) => {
    try {
      console.log('🔐 AuthContext.login - начало', { phone, code, name, role });

      const requestData = { phone, code };
      if (name !== null && name !== undefined) {
        requestData.name = name;
      }
      if (role !== null && role !== undefined) {
        requestData.role = role;
      }

      console.log('📤 AuthContext.login - отправляем данные:', requestData);

      const data = await authApi.verifyCode(requestData);

      console.log('📨 AuthContext.login - ответ от сервера:', data);

      const token = data.access_token || data.accessToken;

      if (!token) {
        console.error('❌ Токен отсутствует в ответе сервера!', data);
        throw new Error('Сервер не вернул токен авторизации');
      }

      console.log('✅ Login successful:', {
        token: token.substring(0, 30) + '...',
        tokenLength: token.length,
        user: data.user
      });

      setToken(token);
      setUser(data.user);

      if (token && token !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        console.log('💾 Токен сохранен в localStorage:', localStorage.getItem('auth_token').substring(0, 30) + '...');
      } else {
        console.error('❌ Попытка сохранить невалидный токен:', token);
        throw new Error('Получен невалидный токен');
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const updateUser = (newUser, newToken) => {
    setUser(newUser);
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('auth_token', newToken);
    }
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    hasRole,
    updateUser,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
