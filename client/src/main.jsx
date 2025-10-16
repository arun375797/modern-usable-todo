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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'today', element: <Today /> },
      { path: 'date/:date', element: <DateView /> },
      { path: 'auth', element: <Auth /> }
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
