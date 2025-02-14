import React, { useEffect } from 'react';
import {
  Activity,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const Navbar = () => {
  const { name } = useParams()

  useEffect(() => {
    if (name) {
      localStorage.setItem("username", name); // Store in localStorage
    }
  }, [name]); 

  const navigate=useNavigate()

  const handlelogout=async()=>{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signout`, {
      method: 'POST',
    });

    if(response.status==200){
      localStorage.removeItem("username")
      console.log("signed out")
      navigate("/signin")
    }
    else {
      console.log("could not sign out")
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-gray-900/95 border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand Name */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-indigo-500" />
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text text-2xl font-bold ml-2">
                  VoxScribe
                </span>
              </div>
              <span className="text-gray-400 text-sm hidden sm:inline-block">
                AI-Powered Speech Recognition
              </span>

            </div>
            {name && 
            <div>
              <button onClick={handlelogout} className="px-4 py-2 text-white font-medium rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 transition-all duration-300 shadow-md">
                Logout
              </button>
            </div>
            }
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;