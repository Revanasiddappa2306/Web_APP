import React, { useEffect, useState } from "react";

const AssignPopup = ({ onClose, selectedPages }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roles/get-roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const toggleRoleSelection = (roleID) => {
    setSelectedRoles((prev) =>
      prev.includes(roleID)
        ? prev.filter((id) => id !== roleID)
        : [...prev, roleID]
    );
  };

  const handleAssign = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pageTable/assign-pages-to-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageIDs: selectedPages,
          roleIDs: selectedRoles,
        }),
      });

      if (res.ok) {
        alert("Pages assigned successfully!");
        onClose();
        window.location.reload();
      } else {
        alert("Assignment failed");
      }
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-[400px]">
        <h3 className="text-lg font-semibold mb-4">Assign Pages to Roles</h3>
        <div className="max-h-48 overflow-y-auto border p-2 rounded mb-4">
          {roles.map((role) => (
            <div key={role.RoleID} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedRoles.includes(role.RoleID)}
                onChange={() => toggleRoleSelection(role.RoleID)}
              />
              <label>{role.Name}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button onClick={handleAssign} className="px-4 py-2 bg-green-600 text-white rounded">Done</button>
        </div>
      </div>
    </div>
  );
};

export default AssignPopup;
