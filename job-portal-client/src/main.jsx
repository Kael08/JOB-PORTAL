
import ReactDOM from 'react-dom/client'
import './assets/styles/index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Router.jsx'
import './locales/i18n'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
)
