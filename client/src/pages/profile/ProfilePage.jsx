import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FiUser, FiPhone, FiBriefcase, FiLogOut, FiRefreshCw } from 'react-icons/fi';
import { apiClient } from '../../services/api/apiClient';
import Swal from 'sweetalert2';

const ProfilePage = () => {
  const { user, logout, isAuthenticated, loading, updateUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isChangingRole, setIsChangingRole] = useState(false);

  // Перенаправляем на логин, если пользователь не авторизован
  React.useEffect(() => {
    if(loading) return;

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate, loading]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleChangeRole = async () => {
    if (isChangingRole) return;

    const currentRole = user.role;
    const newRole = currentRole === 'employer' ? 'job_seeker' : 'employer';
    const roleName = newRole === 'employer' ? t('profile.employer') : t('profile.jobSeeker');

    const result = await Swal.fire({
      title: t('profile.changeRoleConfirm'),
      html: t('profile.changeRoleMessage', { role: roleName }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('profile.confirm'),
      cancelButtonText: t('profile.cancel')
    });

    if (result.isConfirmed) {
      setIsChangingRole(true);
      try {
        const response = await apiClient.patch(`/auth/change-role/${newRole}`);
        
        // Обновляем пользователя и токен
        updateUser(response.user, response.access_token);

        await Swal.fire({
          icon: 'success',
          title: t('profile.roleChanged'),
          text: t('profile.roleChangedMessage', { role: roleName }),
          timer: 2000,
          showConfirmButton: false
        });

        // Если меняли с работодателя на соискателя, показываем предупреждение
        if (currentRole === 'employer' && newRole === 'job_seeker') {
          await Swal.fire({
            icon: 'info',
            title: t('profile.jobsHidden'),
            text: t('profile.jobsHiddenMessage'),
            timer: 3000,
            showConfirmButton: false
          });
        }

        // Перезагружаем страницу для обновления данных
        window.location.reload();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: t('profile.error'),
          text: error.message || t('profile.changeRoleError')
        });
      } finally {
        setIsChangingRole(false);
      }
    }
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
                  <p className="text-sm text-gray-500">{t('profile.name')}</p>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FiPhone className="text-2xl text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">{t('profile.phone')}</p>
                  <p className="text-lg font-medium">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FiBriefcase className="text-2xl text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{t('profile.role')}</p>
                  <p className="text-lg font-medium">
                    {user.role === 'employer' ? t('profile.employer') : t('profile.jobSeeker')}
                  </p>
                </div>
                <button
                  onClick={handleChangeRole}
                  disabled={isChangingRole}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  <FiRefreshCw className={isChangingRole ? 'animate-spin' : ''} />
                  {t('profile.changeRole')}
                </button>
              </div>
            </div>

            {/* Действия */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {t('profile.toJobs')}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <FiLogOut />
                {t('profile.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
