// src/pages/Dashboard.js
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutPopup from "../components/popups/AboutPopup";
import ContactPopup from "../components/popups/ContactPopup";
import UserGuidePopup from "../components/popups/UserGuidePopup";
import RequirementPopup from "../components/popups/RequirementPopup";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"; // or use any icon

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // { name, id }
  const [roles, setRoles] = useState([]);
  const [rolePages, setRolePages] = useState({});
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [hoveredRole, setHoveredRole] = useState(null);
  const hideTimeout = useRef();
  const [showRequirement, setShowRequirement] = useState(false);

  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);
    window.history.replaceState(null, "", window.location.pathname);

    const handlePopState = () => {
      navigate("/user-dashboard", { replace: true });
      window.history.pushState(null, "", window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  useEffect(() => {
    // Fetch roles assigned to this user
    fetch("http://localhost:5000/api/userTable/get-user-roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: user?.id }),
    })
      .then(res => res.json())
      .then(data => setRoles(data.roles || []));
  }, [user?.id]);

  const fetchPagesForRole = async (roleID) => {
    if (rolePages[roleID]) return; // already fetched
    const res = await fetch("http://localhost:5000/api/roles/get-role-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleID }),
    });
    const data = await res.json();
    console.log("Fetched pages for role", roleID, data.pages); // <-- Add this line
    setRolePages(prev => ({ ...prev, [roleID]: data.pages || [] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out successfully!", { autoClose: 1500 });
    setTimeout(() => {
      navigate("/home");
      window.location.reload();
    }, 1500);
  };

  const handleMouseEnter = (roleID) => {
    clearTimeout(hideTimeout.current);
    setHoveredRole(roleID);
    fetchPagesForRole(roleID);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => setHoveredRole(null), 200); // 200ms delay
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-alconBlue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Alcon</h1>
          <nav className="flex items-center gap-8 text-lg font-medium">
          <button
  onClick={() => setShowRequirement(true)}
  className="flex items-center gap-1 hover:underline"
  title="Submit Requirements"
>
  <ClipboardDocumentIcon className="h-5 w-5" />
  <span className="hidden sm:inline">Submit Requirements</span>
</button>
            <button onClick={() => setShowAbout(true)} className="hover:underline">About</button>
            <button onClick={() => setShowContact(true)} className="hover:underline">Contact</button>
            <button onClick={handleLogout} className="hover:text-yellow-300">Logout</button>
          </nav>
        </div>
      </header>
      

      {/* Main Content */}
      <main className="flex-1 bg-slate-100 p-6 relative">
        {/* Guide Icon Top Right */}
        <button
          type="button"
          className="absolute top-6 right-8 text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
          onClick={() => setShowGuide(true)}
          style={{ zIndex: 20 }}
        >
          <QuestionMarkCircleIcon className="h-6 w-6" />
          <span className="hidden sm:inline font-medium">Guide</span>
        </button>
        {/* User info top left */}
        <div className="mb-6">
          <span className="font-semibold text-lg text-blue-900">
            {user?.name} <span className="text-base text-gray-700">({user?.id})</span>
          </span>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Roles</h2>
          <table className="min-w-full bg-white border border-gray-300 shadow">
            <thead>
              <tr>
                <th className="px-2 py-3 border-b w-28 text-left">Role ID</th>
                <th className="px-2 py-3 border-b w-40 text-left">Role Name</th>
                <th className="px-2 py-3 border-b w-32 text-left">Pages</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr
                  key={role.RoleID}
                  className="hover:bg-blue-100 cursor-pointer"
                >
                  <td className="px-2 py-3 border-b w-28">{role.RoleID}</td>
                  <td className="px-2 py-3 border-b w-40">{role.Name}</td>
                  <td className="px-2 py-3 border-b w-32 relative">
                    <span
                      className="text-blue-700 text-xs underline cursor-pointer"
                      onMouseEnter={() => handleMouseEnter(role.RoleID)}
                      onMouseLeave={handleMouseLeave}
                      style={{ position: "relative" }}
                    >
                      Hover to see
                      {hoveredRole === role.RoleID && (
                        <div
                          className="absolute left-1/2 -translate-x-1/4 top-full mt-1 w-56 bg-white border rounded shadow-lg z-20 p-2 pointer-events-auto"
                          onMouseEnter={() => clearTimeout(hideTimeout.current)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="font-semibold mb-2 text-sm text-gray-700">Pages:</div>
                          {rolePages[role.RoleID]?.length > 0 ? (
                            <ul>
                              {rolePages[role.RoleID].map(page => (
                                <li
                                  key={page.PageID}
                                  className="text-blue-700 text-sm py-1 hover:underline cursor-pointer"
                                  onClick={e => {
                                    e.stopPropagation();
                                    navigate(`/generated/${page.PageName.replace(/\s+/g, "_")}`);
                                  }}
                                >
                                  {page.PageName}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-gray-500 text-xs">No pages assigned</div>
                          )}
                        </div>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-4">No roles assigned</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {showAbout && <AboutPopup onClose={() => setShowAbout(false)} />}
      {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
      {showGuide && <UserGuidePopup onClose={() => setShowGuide(false)} />}
      {showRequirement && (<RequirementPopup onClose={() => setShowRequirement(false)} onSubmit={async (form) => {
            try {
              const res = await fetch("http://localhost:5000/api/requirements/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
              });
              res.ok
                ? toast.success("✅ Requirement submitted successfully!", { autoClose: 1500 })
                : toast.error("❌Failed to submit requirement.", { autoClose: 1500 });
            } catch {
              toast.error("❕Network error. Please try again.", { autoClose: 2000 });
            }
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-alconBlue text-white text-center p-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default UserDashboard;















