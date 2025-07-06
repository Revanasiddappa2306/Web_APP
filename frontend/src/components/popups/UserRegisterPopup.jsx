// src/pages/Register.js

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserRegister({ onClose, onSwitchToLogin }) {
  const [registerType, setRegisterType] = useState("user"); // "user" or "admin"
  const [id, setId] = useState(""); // 521ID
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate 521ID and email
    if (!id.trim()) {
      toast.error("521ID is required", { position: "top-center", autoClose: 2000 });
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      toast.error("Email must be a valid @gmail.com address", { position: "top-center", autoClose: 2000 });
      return;
    }

    try {
      const endpoint =
        registerType === "admin"
          ? "http://localhost:5000/api/auth/register-admin"
          : "http://localhost:5000/api/auth/register-user";

      const body =
        registerType === "admin"
          ? { id, firstName, lastName, mobileNum, email, password }
          : { id, firstName, lastName, mobileNum, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          `${registerType === "admin" ? "Admin" : "User"} Registration Successful! Redirecting to login...`,
          { position: "top-center", autoClose: 1500 }
        );
        setTimeout(() => {
          if (onClose) onClose();
          if (onSwitchToLogin) onSwitchToLogin();
        }, 1500);
      } else {
        toast.error(data.message || "Registration failed", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 2000,
      });
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm relative text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-300 text-2xl hover:text-red-500"
        >
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl mb-4">Registration</h2>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="registerType"
                value="user"
                checked={registerType === "user"}
                onChange={() => setRegisterType("user")}
                className="mr-2"
              />
              User
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="registerType"
                value="admin"
                checked={registerType === "admin"}
                onChange={() => setRegisterType("admin")}
                className="mr-2"
              />
              Admin
            </label>
          </div>
          <input
            type="text"
            placeholder="521ID"
            className="w-full p-2 mb-3 text-black rounded"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-2 mb-3 text-black rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-2 mb-3 text-black rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Mobile Number"
            className="w-full p-2 mb-3 text-black rounded"
            value={mobileNum}
            onChange={(e) => setMobileNum(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email (@gmail.com)"
            className="w-full p-2 mb-3 text-black rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button className="w-full bg-green-600 p-2 rounded hover:bg-green-500">
            Register as {registerType === "admin" ? "Admin" : "User"}
          </button>
          <p className="mt-2 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-400 underline bg-transparent border-none p-0 m-0 cursor-pointer"
              style={{ background: "none" }}
            >
              Login
            </button>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}



