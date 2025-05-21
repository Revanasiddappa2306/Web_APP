import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminRegister({ onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, mobileNum, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Admin Registration Successful! Redirecting to login...", {
          position: "top-center",
          autoClose: 1500,
        });
        setTimeout(() => {
          if (onClose) onClose();
          navigate("/admin-login");
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
          <h2 className="text-2xl mb-4">Admin Registration</h2>
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
            placeholder="Email"
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
            Register
          </button>
          <p className="mt-2 text-sm">
            Already have an account?{" "}
            <a href="/admin-login" className="text-blue-400">
              Login
            </a>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}