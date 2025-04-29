// src/pages/Dashboard.js
// import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Button from "../components/Button1";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const handleYourPagesClick = () => {
    navigate("/your-pages");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully!", { autoClose: 1500 });
    setTimeout(() => {
      navigate("/home");
      window.location.reload(); // force UI to refresh
    }, 1500);
   
  };


  const handleCreatePage = () => {
    navigate("/component-selector");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Alcon </h1>
        <div className="flex gap-4">
          
            <>
              <Button text="Create Page" onClick={handleCreatePage} className="bg-yellow-500" />
              <Button text="Your Pages" onClick={handleYourPagesClick} className="bg-green-500" />
              <Button text="Logout" onClick={handleLogout} className="bg-red-500" />
            </>
        
        </div>
      </nav>

      {/* Center Content */}
      <div className="flex-1 bg-green-100 flex flex-col items-center justify-center text-center px-4">
        
          <>
            <h2 className="text-2xl font-semibold text-gray-700">Hello Admin, welcome back...!</h2>
            <h3 className="text-lg font-medium text-gray-600 mt-4">Select "Create Page" to begin new page creation or see your pages</h3>
          </>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;















