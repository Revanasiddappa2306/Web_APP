import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/requirements/all")
      .then(res => res.json())
      .then(setRequests);
  }, []);

  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/api/requirements/mark-read/${id}`, { method: "POST" });
    setRequests(reqs => reqs.map(r => r.RequirementID === id ? { ...r, IsRead: 1 } : r));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-alconBlue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 onClick={() => navigate("/admin-dashboard")} className="text-3xl font-bold cursor-pointer ">Alcon</h1>
          <nav className="flex items-center gap-8 text-lg font-medium">
            <button onClick={() => navigate("/admin-dashboard")} className="hover:text-yellow-300">  Home </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-100 p-8">
        <h2 className="text-2xl font-bold mb-6">All Requests</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">521ID</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Requirements</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.RequirementID} className={req.IsRead ? "" : "bg-yellow-100"}>
                <td className="px-4 py-2">{req.Name}</td>
                <td className="px-4 py-2">{req["521ID"]}</td>
                <td className="px-4 py-2">{req.Email}</td>
                <td className="px-4 py-2">{req.Department}</td>
                <td className="px-4 py-2">{req.Requirements}</td>
                <td className="px-4 py-2">
                  {req.IsRead ? "Read" : <span className="text-red-600 font-semibold">Unread</span>}
                </td>
                <td className="px-4 py-2">
                  {!req.IsRead && (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => markAsRead(req.RequirementID)}
                    >
                      Mark as Read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {/* Footer */}
      <footer className="bg-alconBlue text-white text-center p-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RequestsPage;