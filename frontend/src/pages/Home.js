// src/pages/Home.js
// import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Button from "../components/Button1";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const navigate = useNavigate();
 
  const handleUserLogin = () => {
    navigate("/user-login");
  };

  const handleAdminLogin = () => {
    navigate("/admin-login");
  };

 

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Alcon </h1>
        <div className="flex gap-4">
         
            
            <>
              
              <Button text="Admin Login" onClick={handleAdminLogin} className="bg-purple-600" />
              <Button text="User Login" onClick={handleUserLogin} className="bg-green-500" />
            </>

          
        </div>
      </nav>

      {/* Center Content */}
      <div className="flex-1 bg-green-100 flex flex-col items-center justify-center text-center px-4">
        
        
          <h2 className="text-xl font-semibold text-gray-700">
            Hello there, welcome back.Please login to continue.
          </h2>
        
      </div>

      <ToastContainer />
    </div>
  );
};

export default Home;















