import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'
import Overview from './pages/Overview'
import Today from './pages/Today'
import DateView from './pages/DateView'
import Auth from './pages/Auth'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { 
        index: true, 
        element: (
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'today', 
        element: (
          <ProtectedRoute>
            <Today />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'date/:date', 
        element: (
          <ProtectedRoute>
            <DateView />
          </ProtectedRoute>
        ) 
      },
      { path: 'auth', element: <Auth /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }
    ]
  }
])

const qc = new QueryClient()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </QueryClientProvider>
  </React.StrictMode>
)
