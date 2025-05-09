import React, { useState } from "react";

const CreateRolePopup = ({ onClose, onRoleCreated }) => {
  const [roleName, setRoleName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/roles/create-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: roleName }),
      });

      const data = await res.json();
      if (res.ok) {
        onRoleCreated(data); // Pass the created role to parent
        onClose();
      } else {
        alert(data.message || "Failed to create role");
      }
    } catch (err) {
      console.error("❌ Error creating role:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-[#003595]">Create New Role</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#003595] text-white rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRolePopup;
