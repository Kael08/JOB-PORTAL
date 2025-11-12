import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    Swal.fire({
      icon: 'info',
      title: 'Вы вышли из системы',
      timer: 2000,
      showConfirmButton: false,
    });
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
      Выход
    </button>
  );
};

export default LogoutButton;
