import React, { useEffect, useState } from "react";

const UserAssignPopup = ({ userIDs, onClose }) => {
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
      const res = await fetch("http://localhost:5000/api/userTable/assign-users-to-roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIDs, roleIDs: selectedRoles }),
      });

      const data = await res.json();
      alert(data.message);
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Error assigning users to roles:", err);
      alert("Error assigning users");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-semibold mb-4 text-center">Select Roles</h3>
        <div className="h-40 overflow-y-auto border mb-4 p-2 rounded">
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
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={selectedRoles.length === 0}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAssignPopup;
