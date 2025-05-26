import React, { useEffect, useState } from "react";

const STATUS_OPTIONS = ["Accepted", "Completed", "Rejected"];

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupHeading, setPopupHeading] = useState(""); // New state for popup heading

  useEffect(() => {
    fetch("http://localhost:5000/api/requirements/all")
      .then(res => res.json())
      .then(setRequests);
  }, []);

  // Mark as read and update local state
  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/api/requirements/mark-read/${id}`, { method: "POST" });
    setRequests(reqs => reqs.map(r => r.RequirementID === id ? { ...r, IsRead: 1 } : r));
  };

  // Update status in DB and local state
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/requirements/update-status/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRequests(reqs => reqs.map(r => r.RequirementID === id ? { ...r, Status: status } : r));
  };

  // Open popup and mark as read if unread
  const openPopup = async (content, name, id, reqId, isRead) => {
    setPopupContent(content);
    setPopupHeading(`Requirements by ${name} (${id})`);
    setShowPopup(true);
    if (!isRead) {
      await markAsRead(reqId);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupContent("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-alconBlue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold  ">Alcon</h1>
          <nav className="flex items-center gap-8 text-lg font-medium">
          <h2  className="text-3xl font-bold  ">Requiremnts Page</h2>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-100 p-8">
        <h2 className="text-2xl font-bold mb-6">All Requests</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Req. ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">521ID</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Requirements</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.RequirementID} className={req.IsRead ? "" : "bg-yellow-100"}>
                <td className="px-4 py-2">{req.RequirementID}</td>
                <td className="px-4 py-2">{req.Name}</td>
                <td className="px-4 py-2">{req["521ID"]}</td>
                <td className="px-4 py-2">{req.Email}</td>
                <td className="px-4 py-2">{req.Department}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      openPopup(
                        req.Requirements,
                        req.Name,
                        req["521ID"],
                        req.RequirementID,
                        req.IsRead
                      )
                    }
                  >
                    View
                  </button>
                </td>
                <td className="px-4 py-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={req.Status || ""}
                    onChange={e => updateStatus(req.RequirementID, e.target.value)}
                  >
                    <option value="">Select</option>
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {/* Popup for Requirements */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            {/* X Close Icon */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={closePopup}
              aria-label="Close"
              style={{ lineHeight: 1 }}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-center text-alconBlue">{popupHeading}</h3> {/* Use popupHeading here */}
            <div className="mb-4 whitespace-pre-line">{popupContent}</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-alconBlue text-white text-center p-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RequestsPage;