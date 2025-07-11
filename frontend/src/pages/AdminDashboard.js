import { useNavigate } from "react-router-dom";
import React, { useState, useEffect} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutPopup from "../components/popups/AboutPopup";
import ContactPopup from "../components/popups/ContactPopup";
import PageTable from "../components/tables/PageTable";
import RoleTable from "../components/tables/RoleTable";
import UserTable from "../components/tables/UserTable";
import RolePageAssignmentsTable from "../components/tables/RolePageAssignmentsTable";
import UserRoleAssignmentsTable from "../components/tables/UserRoleAssignmentsTable";
import AdminGuidePopup from "../components/popups/AdminGuidePopup";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin")); // { name, id }
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  // Prevent back navigation to protected pages
  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);
    window.history.replaceState(null, "", window.location.pathname);
  
    const handlePopState = () => {
      navigate("/admin-dashboard", { replace: true });
      window.history.pushState(null, "", window.location.pathname);
    };
  
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);
  
  useEffect(() => {
    const fetchUnread = async () => {
      const res = await fetch("http://localhost:5000/api/requirements/unread-count");
      const data = await res.json();
      setUnreadCount(data.count);
    };
    fetchUnread();
    // Optionally, poll every 30s:
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const handleYourPagesClick = () => {
    navigate("/your-pages");
  };

  const handleCreatePage = () => {
    navigate("/component-selector");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    toast.info("Logged out successfully!", { autoClose: 1500 });
    setTimeout(() => {
      navigate("/home");
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-alconBlue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Web_APP</h1>
          <nav className="flex items-center gap-8 text-lg font-medium">
            
            <button onClick={handleCreatePage} className="hover:text-yellow-300"> Create Page </button>
            <button onClick={handleYourPagesClick} className="hover:text-yellow-300" > Pages Created </button>
            <button onClick={() => setShowAbout(true)} className="hover:text-yellow-300">About</button>
            <button onClick={() => setShowContact(true)} className="hover:text-yellow-300">Contact</button>
            <button onClick={() => window.open("/requests", "_blank")} className="relative hover:text-yellow-300">
              Requests
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )} </button>
            <button onClick={handleLogout} className="hover:text-yellow-300">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="flex-1 bg-slate-100 p-6 space-y-12"
        // style={{
        //   backgroundImage: " url('/assets/bg-dh.jpeg')",
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   backgroundRepeat: "no-repeat",
        // }}
        
      >
        {/* Admin info top left */}
        <div className="mb-6">
          <span className="font-semibold text-lg text-blue-900">
            {admin?.name} <span className="text-base text-gray-700">({admin?.id})</span>
          </span>
        </div>
        <button type="button" className="absolute top-6 right-8 text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                onClick={() => setShowGuide(true)} style={{ zIndex: 20 }}> <QuestionMarkCircleIcon className="h-6 w-6" />
               <span className="hidden sm:inline font-medium">Guide</span>
          </button>
        <div className="flex justify-between">
               <PageTable />
               <RoleTable />
               
            </div>
           <div className="flex justify-between">
               <UserTable />
               <RolePageAssignmentsTable />
           </div>

           <div className="flex justify-between">
               <UserRoleAssignmentsTable />
           </div>
        </main>



       {/* Modal */}
       {showAbout && <AboutPopup onClose={() => setShowAbout(false)} />}
       {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
       {showGuide && <AdminGuidePopup onClose={() => setShowGuide(false)} />}
      

         {/* Footer */}
      <footer className="bg-alconBlue text-white text-center p-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()}  All rights reserved.</p>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;