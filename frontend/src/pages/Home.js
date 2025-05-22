import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutPopup from "../components/popups/AboutPopup";
import ContactPopup from "../components/popups/ContactPopup";
import AdminLogin from "../components/popups/AdminLoginPopup";
import UserLogin from "../components/popups/UserLoginPopup";
import RequirementPopup from "../components/popups/RequirementPopup";
import { ClipboardDocumentIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import HomeGuidePopup from "../components/popups/HomeGuidePopup"; // You need to create this

const Home = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showRequirementPopup, setShowRequirementPopup] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Prevent back navigation to protected pages
  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);
    window.history.replaceState(null, "", window.location.pathname);

    const handlePopState = () => {
      navigate("/home", { replace: true });
      window.history.pushState(null, "", window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const handleRequirementSubmit = async (form) => {
    try {
      const res = await fetch("http://localhost:5000/api/requirements/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("✅ Requirement submitted successfully!", { autoClose: 1500 });
      } else {
        toast.error("❌Failed to submit requirement.", { autoClose: 1500 });
      }
    } catch (error) {
      toast.error("❕Network error. Please try again.", { autoClose: 2000 });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-alconBlue text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Alcon</h1>
          <nav className="flex items-center gap-8 text-lg font-medium relative">
            {/* Login Dropdown */}
            <div className="group relative">
              <button className="hover:underline focus:outline-none">Login</button>
              <div className="absolute top-full left-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200 z-10">
                <button onClick={() => setShowAdminLogin(true)} className="block w-full text-left px-4 py-2 hover:bg-blue-100">Admin Login</button>
                <button onClick={() => setShowUserLogin(true)} className="block w-full text-left px-4 py-2 hover:bg-blue-100">User Login</button>
              </div>
            </div>
            <button
              onClick={() => setShowRequirementPopup(true)}
              className="flex items-center gap-1 hover:underline"
              title="Submit Requirements"
            >
              <ClipboardDocumentIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Submit Requirements</span>
            </button>
            <button onClick={() => setShowAbout(true)} className="hover:underline">About</button>
            <button onClick={() => setShowContact(true)} className="hover:underline">Contact</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-100 flex flex-col items-center justify-center text-center px-4 relative">
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
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to Alcon Portal</h2>
        <p className="text-lg text-gray-600 max-w-xl mb-6">
          This is your one-stop platform for managing roles, accessing pages, and collaborating efficiently within the Alcon ecosystem.
          <br /><br />
          <span className="font-medium text-blue-900">Admins</span> can create and assign pages, manage users, and oversee all activities.<br />
          <span className="font-medium text-blue-900">Users</span> can access their assigned roles and pages, and interact with the system as per their permissions.
        </p>
        <div className="mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-base font-medium">
            Please use the <span className="font-semibold">Login</span> button above to sign in as Admin or User.
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Need help? Use the <span className="underline">About</span> or <span className="underline">Contact</span> buttons in the menu.
        </p>
      </main>

      {/* Modals */}
      {showAbout && <AboutPopup onClose={() => setShowAbout(false)} />}
      {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
      {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}
      {showUserLogin && <UserLogin onClose={() => setShowUserLogin(false)} />}
      {showRequirementPopup && (
        <RequirementPopup
          onClose={() => setShowRequirementPopup(false)}
          onSubmit={handleRequirementSubmit}
        />
      )}
      {showGuide && <HomeGuidePopup onClose={() => setShowGuide(false)} />}

      {/* Footer */}
      <footer className="bg-alconBlue text-white text-center py-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default Home;
