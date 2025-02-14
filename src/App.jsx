

import './App.css'
import Navbar from './components/Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'

function App() {
  const navigate = useNavigate()
  const storedName = sessionStorage.getItem("username")

  useEffect(()=>{
    if(!storedName){
      navigate("/signin")
    }
  },[storedName])
  
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
