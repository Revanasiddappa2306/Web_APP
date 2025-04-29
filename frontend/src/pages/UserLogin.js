// src/pages/Login.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserLogin() {
  const [userIdOrEmail, setUserIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIdOrEmail, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login Successful 👍🫡", {
          position: "top-center",
          autoClose: 1500,
        });
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/user-dashboard"), 1500); // Navigate after toast
      } else {
        toast.error(data.message || "Login failed!", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 2000,
      });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form
        className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4">User Login</h2>

        <input
          type="text"
          placeholder="User ID or Email"
          className="w-full p-2 mb-3 text-black rounded"
          value={userIdOrEmail}
          onChange={(e) => setUserIdOrEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 text-black rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 p-2 rounded hover:bg-blue-500">
          Login
        </button>

        <p className="mt-2 text-sm">
          Don't have an account?{" "}
          <a href="/user-register" className="text-blue-400">
            Register
          </a>
        </p>
      </form>

      {/* Toast container renders all toasts */}
      <ToastContainer />
    </div>
  );
}




