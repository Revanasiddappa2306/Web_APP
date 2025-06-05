import React, { useEffect, useState } from "react";

const STATUS_OPTIONS = ["Accepted", "Completed", "Rejected"];

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupHeading, setPopupHeading] = useState(""); // New state for popup heading
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    // Set the browser tab title
    document.title = "Requests";
  }, []);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/requirements/all")
      .then(res => res.json())
      .then(setRequests);
  }, []);

  useEffect(() => {
    const url = showDeleted
      ? "http://localhost:5000/api/requirements/deleted"
      : "http://localhost:5000/api/requirements/all";
    fetch(url)
      .then(res => res.json())
      .then(setRequests);
  }, [showDeleted]);

  // Mark as read and update local state
  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/api/requirements/mark-read/${id}`, { method: "POST" });
    setRequests(reqs => reqs.map(r => r.RequirementID === id ? { ...r, IsRead: 1 } : r));
  };

  // Update status in DB and local state, then open Outlook mailto
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/requirements/update-status/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRequests(reqs => reqs.map(r => r.RequirementID === id ? { ...r, Status: status } : r));

    // Find the request to get recipient email and details
    const req = requests.find(r => r.RequirementID === id);
    if (req) {
      // Compose mailto link
      const recipientEmail = req.Email;
      const subject = encodeURIComponent(`Your Requirement Status Updated: ${status}`);
      const body = encodeURIComponent(
        `Hello ${req.Name},\n\n` +
        `Your requirement (ID: ${req.RequirementID}) status has been updated to: ${status}.\n\n` +
        `Details:\n` +
        `521ID: ${req["521ID"]}\n` +
        `Department: ${req.Department}\n` +
        `Requirements: ${req.Requirements}\n\n` +
        `If you have any questions, please reply to this email.\n\n` +
        `Best regards,\nAlcon Admin`
      );
      // This will open Outlook or default mail client with the admin/device account as sender
      window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    }
  };

  // Open popup and mark as read if unread
  const openPopup = async (content, name, id, reqId, isRead) => {
    let displayContent = "";
    try {
      const reqObj = JSON.parse(content);

      if (typeof reqObj === "object" && reqObj !== null) {
        displayContent += reqObj.pageName ? `Page Name: ${reqObj.pageName}\n\n` : "";
        if (reqObj.components && Array.isArray(reqObj.components)) {
          displayContent += "Components and Quantities:\n";
          reqObj.components.forEach(c => {
            displayContent += `- ${c.name}: ${c.quantity}\n`;
          });
          displayContent += "\nComponent Fields:\n";
          reqObj.components.forEach(c => {
            c.fields.forEach((f, idx) => {
              displayContent += `${c.name} Field${idx + 1}: ${f}\n`;
            });
          });
        }
        if (reqObj.justification) {
          displayContent += `\nJustification:\n${reqObj.justification}`;
        }
      } else {
        displayContent = content;
      }
    } catch (e) {
      // If not JSON, show as is
      displayContent = content;
    }

    setPopupContent(displayContent);
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
        {/* Toggle button for deleted requests */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowDeleted(v => !v)}
          >
            {showDeleted ? "Show Active Requests" : "Show Deleted Requests"}
          </button>
        </div>
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
              <th className="px-4 py-2">Actions</th>
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
                <td className="px-4 py-2">
                  {!showDeleted && (
                    <button
                      className="text-red-600 hover:underline"
                      title="Delete"
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this request?")) {
                          await fetch(`http://localhost:5000/api/requirements/delete/${req.RequirementID}`, { method: "POST" });
                          setRequests(requests => requests.filter(r => r.RequirementID !== req.RequirementID));
                        }
                      }}
                    >
                      🗑️
                    </button>
                  )}
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