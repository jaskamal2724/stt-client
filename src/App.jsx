

import './App.css'
import Navbar from './components/Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'

function App() {
  const navigate = useNavigate()
  const [username, setUsername] = useState(sessionStorage.getItem("username"));


  useEffect(()=>{
    if(!username){
      navigate("/signin")
    }
  },[username, navigate])
  
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
