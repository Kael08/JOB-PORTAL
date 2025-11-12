import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../services/api/authApi';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, user, logout, isAuthenticated} = useAuth();

  const [step, setStep] = useState(1); // 1 - ввод телефона, 2 - ввод кода
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('job_seeker');
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false); // Флаг существующего пользователя

  // Если пользователь уже авторизован, перенаправляем на главную
  React.useEffect(() => {
    if (!loading && isAuthenticated && user) {
      navigate('/', { replace: true });
    }
  }, [loading, isAuthenticated, user, navigate]);

  // Функция нормализации номера телефона
  const normalizePhone = (phoneNumber) => {
    // Удаляем все символы кроме цифр
    let digits = phoneNumber.replace(/\D/g, '');

    // Если номер начинается с 8, заменяем на 7
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    }

    // Если номер начинается с 9 (без кода страны), добавляем 7
    if (digits.startsWith('9') && digits.length === 10) {
      digits = '7' + digits;
    }

    // Добавляем + в начало
    return '+' + digits;
  };

  // Функция форматирования номера для отображения
  const formatPhoneDisplay = (phoneNumber) => {
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('7')) {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    }
    return phoneNumber;
  };

  // Обработка ввода номера телефона
  const handlePhoneChange = (e) => {
    const input = e.target.value;
    // Позволяем вводить только цифры и символы + ( ) -
    const filtered = input.replace(/[^\d+()-\s]/g, '');
    setPhone(filtered);
  };

  // Шаг 1: Отправка SMS кода
  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!phone) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: 'Введите номер телефона',
      });
      return;
    }

    // Нормализуем номер
    const normalizedPhone = normalizePhone(phone);

    // Проверяем, что номер содержит 11 цифр (7XXXXXXXXXX)
    const digits = normalizedPhone.replace(/\D/g, '');
    if (digits.length !== 11 || !digits.startsWith('7')) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: 'Введите корректный российский номер телефона',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.sendCode(normalizedPhone);
      setPhone(normalizedPhone); // Сохраняем нормализованный номер
      setIsExistingUser(response.isExistingUser || false); // Сохраняем флаг существующего пользователя

      await Swal.fire({
        icon: 'success',
        title: 'Код отправлен',
        text: `SMS код отправлен на номер ${formatPhoneDisplay(normalizedPhone)}`,
        timer: 2000,
        showConfirmButton: false,
      });
      setStep(2);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Шаг 2: Верификация кода
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!code) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: 'Введите код из SMS',
      });
      return;
    }

    // Для новых пользователей требуем имя и роль
    if (!isExistingUser && (!name || !role)) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: 'Заполните все поля',
      });
      return;
    }

    setLoading(true);
    try {
      // Для существующих пользователей передаем null вместо имени и роли
      const result = await login(
        phone,
        code.trim(),
        isExistingUser ? null : name?.trim(),
        isExistingUser ? null : role
      );

      if (result.success) {
        const userName = result.user?.name || name || 'Пользователь';
        await Swal.fire({
          icon: 'success',
          title: 'Успешно!',
          text: `Добро пожаловать, ${userName}!`,
          timer: 1500,
          showConfirmButton: false,
        });
        // Небольшая задержка, чтобы состояние успело обновиться
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: error.message || 'Неверный код',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    Swal.fire({
      icon: 'info',
      title: 'Вы вышли из системы',
    });
  };

  // Если пользователь уже авторизован
  if (user) {
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <div className="flex flex-col items-center max-w-md w-full p-6">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold mb-2">Вы авторизованы</h2>
            <p className="text-lg mb-2"><strong>Имя:</strong> {user.name}</p>
            <p className="text-lg mb-2"><strong>Телефон:</strong> {user.phone}</p>
            <p className="text-lg mb-4">
              <strong>Роль:</strong> {user.role === 'employer' ? 'Работодатель' : 'Соискатель'}
            </p>
          </div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen w-full flex items-center justify-center bg-gray-50'>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          {step === 1 ? 'Вход / Регистрация' : 'Подтверждение'}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Номер телефона
              </label>
              <input
                type="tel"
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={handlePhoneChange}
                autoComplete="tel"
              />
              <p className="text-xs text-gray-500 mt-1">
                Можно вводить с 8, +7 или без кода страны
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: loading ? '#93c5fd' : '#2563eb' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка...
                </span>
              ) : 'Получить код'}
            </button>
          </form>
        ) : step === 2 ? (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            {/* Показываем номер телефона */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">
                {isExistingUser ? 'С возвращением! Код отправлен на:' : 'Код отправлен на номер:'}
              </p>
              <p className="text-lg font-bold text-gray-800">{formatPhoneDisplay(phone)}</p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Код из SMS
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                placeholder="• • • •"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                maxLength="4"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Введите 4-значный код из SMS
              </p>
            </div>

            {/* Показываем поля имени и роли только для новых пользователей */}
            {!isExistingUser && (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Иван Иванов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Я -
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="role"
                        value="job_seeker"
                        checked={role === 'job_seeker'}
                        onChange={(e) => setRole(e.target.value)}
                        className="mr-3 w-4 h-4"
                      />
                      <span className="font-medium">Ищу работу (Соискатель)</span>
                    </label>
                    <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="role"
                        value="employer"
                        checked={role === 'employer'}
                        onChange={(e) => setRole(e.target.value)}
                        className="mr-3 w-4 h-4"
                      />
                      <span className="font-medium">Ищу сотрудников (Работодатель)</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setCode('');
                  setName('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              >
                Назад
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: loading ? '#93c5fd' : '#2563eb' }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Проверка...
                  </span>
                ) : 'Войти'}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default LoginPage;
