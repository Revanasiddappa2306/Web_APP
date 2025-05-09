import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutPopup from "../components/AboutPopup";
import ContactPopup from "../components/ContactPopup";
import CreateRolePopup from "../components/CreateRolePopup";
import RoleTable from "../components/tables/RoleTable";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [roles, setRoles] = useState([]);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  

  const handleYourPagesClick = () => {
    navigate("/your-pages");
  };

  const handleCreatePage = () => {
    navigate("/component-selector");
  };


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

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully!", { autoClose: 1500 });
    setTimeout(() => {
      navigate("/home");
      window.location.reload();
    }, 1500);
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


  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-alconBlue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Alcon</h1>
          <nav className="flex items-center gap-8 text-lg font-medium">
                {/* Actions Dropdown */}
                <div className="relative group">
                  <button className="hover:text-yellow-300">Actions</button>
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform scale-95 group-hover:scale-100 transition-all duration-200 z-10">
                    <button
                      onClick={handleCreatePage}
                      className="px-4 py-2 hover:bg-gray-100 text-left w-full"
                    >
                      Create Page
                    </button>
                    <button
                      onClick={handleYourPagesClick}
                      className="px-4 py-2 hover:bg-gray-100 text-left w-full"
                    >
                      Pages Created
                    </button>
                  </div>
                </div>
                      <button onClick={() => setShowAbout(true)} className="hover:underline">About</button>
                      <button onClick={() => setShowContact(true)} className="hover:underline">Contact</button>
                      <button onClick={handleLogout} className="hover:text-yellow-300">  Logout</button>
            </nav>

        </div>
      </header>

      {/* Main Content */}

      <main className="flex-1 bg-slate-100 p-6">
        {/* <div className="bg-white rounded shadow p-4 w-[40%] ml-[5%]">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Roles Management</h2>
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
          </div> */}

          {/* Buttons */}
          {/* <div className="flex justify-center gap-6">
            <button onClick={() => setShowCreateRole(true)} className="bg-[#003595] text-white px-4 py-2 rounded hover:bg-blue-800"> Create Role </button>
            <button onClick={handleDeleteSelected} disabled={selectedRoles.length === 0} className={`mt-4 px-4 py-2 text-white rounded ${
              selectedRoles.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}> Delete </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Assign</button>
          </div>
        </div> */}

        <RoleTable roles = {roles} />
      </main>


       {/* Modal */}
       {showAbout && <AboutPopup onClose={() => setShowAbout(false)} />}
       {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
       {showCreateRole && ( <CreateRolePopup onClose={() => setShowCreateRole(false)} onRoleCreated={handleRoleCreated} />)}

         {/* Footer */}
      <footer className="bg-alconBlue text-white text-center p-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;