

import './App.css'
import Navbar from './components/Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function App() {
  const navigate = useNavigate()
  const storedName = localStorage.getItem("username")

  useEffect(()=>{
    if(!storedName){
      navigate("/signin")
    }
  },[storedName,navigate])

  return (
    <>
     <Navbar />
      <div>
        <Outlet /> {/* This will render SignIn, SignUp, or other pages */}
      </div>
    </>
  )
}

export default App
