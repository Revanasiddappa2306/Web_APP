import React, { useEffect, useState } from "react";

const RequestsPopup = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/requirements/all")
      .then(res => res.json())
      .then(setRequests);
  }, []);

  if (!requests.length) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
          <button
            className="absolute top-2 right-2 text-xl text-gray-700 hover:text-red-500"
            onClick={onClose}
          >×</button>
          <h2 className="text-xl font-semibold mb-4">Requests</h2>
          <p>No requests found.</p>
        </div>
      </div>
    );
  }

  const req = requests[selected];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-xl text-gray-700 hover:text-red-500"
          onClick={onClose}
        >×</button>
        <h2 className="text-xl font-semibold mb-4">Requests</h2>
        <div className="mb-4">
          <strong>Name:</strong> {req.Name}<br />
          <strong>521ID:</strong> {req["521ID"]}<br />
          <strong>Email:</strong> {req.Email}<br />
          <strong>Department:</strong> {req.Department}<br />
          <strong>Requirements:</strong>
          <div className="border p-2 rounded mt-1 bg-gray-50">{req.Requirements}</div>
          <div className="text-xs text-gray-400 mt-2">Submitted: {new Date(req.CreatedAt).toLocaleString()}</div>
        </div>
        <div className="flex justify-between">
          <button
            disabled={selected === 0}
            onClick={() => setSelected(selected - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >Prev</button>
          <button
            disabled={selected === requests.length - 1}
            onClick={() => setSelected(selected + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default RequestsPopup;