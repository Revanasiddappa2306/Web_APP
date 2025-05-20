import React, { useState, useEffect } from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateRolePopup from "../CreateRolePopup";


const RoleTable = () => {
    const [roles, setRoles] = useState([]);
    const [showCreateRole, setShowCreateRole] = useState(false);
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
          console.error("❌ Error fetching roles:", err);
        }
      };
    
      const handleRoleCreated = (newRole) => {
      setRoles((prev) => [...prev, newRole]);
      };
    
      const toggleRoleSelection = (roleID) => {
        setSelectedRoles((prev) =>
          prev.includes(roleID)
            ? prev.filter((id) => id !== roleID)
            : [...prev, roleID]
        );
      };
    
      const handleDeleteSelected = async () => {
        const confirmDelete = window.confirm(
          `Are you sure you want to delete ${selectedRoles.length} role(s)?`
        );
        if (!confirmDelete) return;
    
        try {
          for (const roleID of selectedRoles) {
            await fetch(`http://localhost:5000/api/roles/delete-role/${roleID}`, {
              method: "DELETE",
            });
          }
          toast.success("Selected roles deleted successfully");
          setRoles((prev) => prev.filter((role) => !selectedRoles.includes(role.RoleID)));
          setSelectedRoles([]);
        } catch (error) {
          console.error("❌ Error deleting roles:", error);
          toast.error("Error deleting selected roles");
        }
      };
        
 return(
  <div className="bg-white rounded shadow p-4 w-[45%] mr-[2%]">
        <h2 className="text-center font-semibold text-gray-700 mb-4">Roles Management</h2>
     <div className="h-64 overflow-y-auto border rounded mb-4">
            <table className="table-auto w-full text-left border">
                <thead className="bg-gray-200">
                <tr>
                    <th className="px-4 py-2">Select</th>
                    <th className="px-4 py-2">Role ID</th>
                    <th className="px-4 py-2">Role Name</th>
                </tr>
                </thead>
                <tbody>
                {roles.map((role) => (
                    <tr key={role.RoleID} className="border-t">
                    <td className="px-4 py-2">
                        <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.RoleID)}
                        onChange={() => toggleRoleSelection(role.RoleID)}
                        />
                    </td>
                    <td className="px-4 py-2">{role.RoleID}</td>
                    <td className="px-4 py-2">{role.Name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
            <div className="flex justify-center gap-6">
                    <button onClick={() => setShowCreateRole(true)} className="bg-[#003595] text-white px-4 py-2 rounded hover:bg-blue-800"> Create Role </button>
                    <button onClick={handleDeleteSelected} disabled={selectedRoles.length === 0} className={` px-4 py-2 text-white rounded ${
                    selectedRoles.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                    }`}> Delete </button>
                    
            </div>
            {showCreateRole && ( <CreateRolePopup onClose={() => setShowCreateRole(false)} onRoleCreated={handleRoleCreated} />)}
    </div>

    
);
};

export default RoleTable;
