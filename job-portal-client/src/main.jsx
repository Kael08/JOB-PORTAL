
import ReactDOM from 'react-dom/client'
import './assets/styles/index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Router.jsx'
import './locales/i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
