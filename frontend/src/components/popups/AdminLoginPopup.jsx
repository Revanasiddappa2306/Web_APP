import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRegister from "./AdminRegisterPopup";


export default function AdminLogin({ onClose }) {
  const [adminIdOrEmail, setAdminIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminIdOrEmail, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login Successful 👍🫡", {
          position: "top-center",
          autoClose: 1500,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));
        setTimeout(() => {
          if (onClose) onClose();
          navigate("/admin-dashboard");
        }, 1500);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm relative text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-300 text-2xl hover:text-red-500"
        >
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="User ID or Email"
            className="w-full p-2 mb-3 text-black rounded"
            value={adminIdOrEmail}
            onChange={(e) => setAdminIdOrEmail(e.target.value)}
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
            <button
    type="button"
    onClick={() => setShowRegister(true)}
    className="text-blue-400 underline bg-transparent border-none p-0 m-0 cursor-pointer"
    style={{ background: "none" }}
  >
    Register
  </button>
          </p>
        </form>

        {showRegister && <AdminRegister onClose={() => setShowRegister(false)} />}
        <ToastContainer />
      </div>
    </div>
  );
}