import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthDebugPanel = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [localStorageToken, setLocalStorageToken] = useState(null);
  const [localStorageUser, setLocalStorageUser] = useState(null);

  useEffect(() => {
    const updateLocalStorage = () => {
      setLocalStorageToken(localStorage.getItem('auth_token'));
      setLocalStorageUser(localStorage.getItem('auth_user'));
    };

    updateLocalStorage();

    const interval = setInterval(updateLocalStorage, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Открыть панель отладки"
      >
        🔍 Debug
      </button>
    );
  }

  const formatToken = (token) => {
    if (!token) return 'ОТСУТСТВУЕТ';
    return `${token.substring(0, 20)}...${token.substring(token.length - 10)}`;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-purple-600 rounded-lg shadow-2xl p-4 z-50 max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-purple-600">🔍 Отладка авторизации</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 font-bold"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="border-b pb-2">
          <h4 className="font-semibold mb-1 text-purple-600">📦 AuthContext</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Аутентифицирован: <strong>{isAuthenticated ? 'ДА' : 'НЕТ'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${token ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Токен в контексте: <strong>{token ? 'ЕСТЬ' : 'НЕТ'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${user ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Пользователь: <strong>{user ? user.name : 'НЕТ'}</strong></span>
            </div>
            {user && (
              <div className="ml-5 text-xs text-gray-600">
                <div>ID: {user.id}</div>
                <div>Телефон: {user.phone}</div>
                <div>Роль: {user.role}</div>
              </div>
            )}
          </div>
        </div>

        <div className="border-b pb-2">
          <h4 className="font-semibold mb-1 text-purple-600">💾 LocalStorage</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${localStorageToken ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Токен: <strong>{localStorageToken ? 'ЕСТЬ' : 'НЕТ'}</strong></span>
            </div>
            {localStorageToken && (
              <div className="ml-5 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-20">
                {formatToken(localStorageToken)}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${localStorageUser ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Пользователь: <strong>{localStorageUser ? 'ЕСТЬ' : 'НЕТ'}</strong></span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-1 text-purple-600">🔍 Диагностика</h4>
          <div className="space-y-1 text-xs">
            {!isAuthenticated && (
              <div className="text-red-600">
                ❌ Не авторизован - перейдите на /login
              </div>
            )}
            {isAuthenticated && !token && (
              <div className="text-orange-600">
                ⚠️ Токен отсутствует в контексте
              </div>
            )}
            {isAuthenticated && !localStorageToken && (
              <div className="text-orange-600">
                ⚠️ Токен отсутствует в localStorage
              </div>
            )}
            {isAuthenticated && token && localStorageToken && (
              <div className="text-green-600">
                ✅ Всё в порядке!
              </div>
            )}
            {user && user.role !== 'employer' && (
              <div className="text-orange-600">
                ⚠️ Вы не работодатель - создание вакансий недоступно
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(localStorageToken || '');
              alert('Токен скопирован в буфер обмена!');
            }}
            disabled={!localStorageToken}
            className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📋 Копировать токен
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            🗑️ Очистить всё
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugPanel;
