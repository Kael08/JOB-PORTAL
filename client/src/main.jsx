
import ReactDOM from 'react-dom/client'
import './assets/styles/index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Router.jsx'
import './locales/i18n'
import { AuthProvider } from './contexts/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);

// Обработка редиректа ПОСЛЕ полной загрузки React (если нужна очистка кеша)
if (window.__NEEDS_RELOAD__) {
  // Ждем полного монтирования React (включая все useEffect)
  setTimeout(() => {
    // Проверяем, что React действительно смонтировался
    const rootElement = document.getElementById('root');
    if (rootElement && rootElement.children.length > 0) {
      console.log('[Cache] React mounted, reloading with cache bust...');
      window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
    } else {
      // Если React не смонтировался, редирект все равно нужен
      window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
    }
  }, 500); // Задержка для надежного монтирования React
}
