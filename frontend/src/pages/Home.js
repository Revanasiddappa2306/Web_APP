// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-alconBlue text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Alcon</h1>

          <nav className="flex items-center gap-8 text-lg font-medium relative">
            {/* Login Dropdown */}
            <div className="group relative">
              <button className="hover:underline focus:outline-none">
                Login
              </button>
              <div className="absolute top-full left-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform scale-95 group-hover:scale-100 transition-all duration-200 z-10">
                <button
                  onClick={handleAdminLogin}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                >
                  Admin Login
                </button>
                <button
                  onClick={handleUserLogin}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                >
                  User Login
                </button>
              </div>
            </div>

            {/* Static Links */}
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-100 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Hello there, welcome back!
        </h2>
        <p className="text-lg text-gray-600 max-w-xl">
          Please login using the dropdown above to continue. Select Admin or User login as per your role.
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-alconBlue text-white text-center py-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default Home;
