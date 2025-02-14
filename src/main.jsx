import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import AudioInterface from './components/AudioInterface'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      {path:"dashboard/:name",element:<AudioInterface/>}
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
