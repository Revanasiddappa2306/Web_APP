// src/pages/Dashboard.js
// import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Button from "../components/Button1";
import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  
  const handleYourPagesClick = () => {
    // navigate("/your-pages");
    toast.info("Not assigned any pages😒!", { autoClose: 1500 });

  };
  const handleAboutClick = () => {
    navigate("/about");
  };
  const handleContactClick = () => {
    navigate("/contact");
  };


  const handleLogout = () => {
    toast.info("Logged out successfully 🫡👍", { autoClose: 1500 });
    setTimeout(() => {
      navigate("/home");
      
      window.location.reload(); // force UI to refresh
    }, 1500);
    
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Alcon </h1>
        <div className="flex gap-4">
          
            <>
              
              <Button text="Assigned Pages" onClick={handleYourPagesClick} className="bg-green-500" />
              <button onClick={handleAboutClick} className="hover:text-yellow-300"> About </button>
              <button onClick={handleContactClick} className="hover:text-yellow-300"> Contact </button>
              <Button text="Logout" onClick={handleLogout} className="bg-red-500" />
            </>
        
        </div>
      </nav>

      {/* Center Content */}
      <div className="flex-1 bg-green-100 flex flex-col items-center justify-center text-center px-4">
        
          <>
            <h2 className="text-2xl font-semibold text-gray-700">Hello User, welcome back...!</h2>
            <h3 className="text-lg font-medium text-gray-600 mt-4">Now you can access pages assigned to you and enter the data whenever needed.</h3>
          </>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserDashboard;















