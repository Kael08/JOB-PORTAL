
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

if (window.__NEEDS_RELOAD__) {
  setTimeout(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && rootElement.children.length > 0) {
      console.log('[Cache] React mounted, reloading with cache bust...');
      window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
    } else {
      window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
    }
  }, 500);
}
