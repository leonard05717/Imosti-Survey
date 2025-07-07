import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Course from './AdminSide/Course.jsx';
import Admin from './Admin.jsx';


const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: 'admin',
    element: <Admin />,
    children: [
      {
        path: 'course',
        element: <Course />
      },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
        <ModalsProvider> 
        <RouterProvider router={routers} />
        </ModalsProvider>
    </MantineProvider>
  </StrictMode>
)
