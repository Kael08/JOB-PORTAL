import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiPhone, FiBriefcase, FiLogOut } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Перенаправляем на логин, если пользователь не авторизован
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                <p className="text-blue-100">
                  {user.role === 'employer' ? 'Работодатель' : 'Соискатель'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Личная информация</h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FiUser className="text-2xl text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Имя</p>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FiPhone className="text-2xl text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Телефон</p>
                  <p className="text-lg font-medium">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FiBriefcase className="text-2xl text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Роль</p>
                  <p className="text-lg font-medium">
                    {user.role === 'employer' ? 'Работодатель' : 'Соискатель'}
                  </p>
                </div>
              </div>
            </div>

            {/* Действия */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                К вакансиям
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <FiLogOut />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
