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
import HomeGuidePopup from "../components/popups/HomeGuidePopup";

const HERO_HEIGHT = "70vh";

const Home = () => {
  const navigate = useNavigate();
  // Modal state for all popups
  const [modals, setModals] = useState({
    about: false, contact: false, admin: false, user: false, req: false, guide: false
  });

  // Prevent browser back navigation from leaving the page
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

  // Handle requirement form submission
  const handleRequirementSubmit = async (form) => {
    try {
      const res = await fetch("http://localhost:5000/api/requirements/submit", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      res.ok
        ? toast.success("✅ Requirement submitted successfully!", { autoClose: 1500 })
        : toast.error("❌Failed to submit requirement.", { autoClose: 1500 });
    } catch {
      toast.error("❕Network error. Please try again.", { autoClose: 2000 });
    }
  };

  // Open/close modal helpers
  const open = (key) => setModals((m) => ({ ...m, [key]: true }));
  const close = (key) => setModals((m) => ({ ...m, [key]: false }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-alconBlue text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Alcon</h1>
          <nav className="flex items-center gap-8 text-lg font-medium relative">
            {/* Login Dropdown */}
            <div className="group relative">
              <button className="hover:underline focus:outline-none">Login</button>
              <div className="absolute top-full left-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200 z-10">
                <button onClick={() => open("admin")} className="block w-full text-left px-4 py-2 hover:bg-blue-100">Admin Login</button>
                <button onClick={() => open("user")} className="block w-full text-left px-4 py-2 hover:bg-blue-100">User Login</button>
              </div>
            </div>
            {/* Submit Requirements */}
            <button onClick={() => open("req")} className="flex items-center gap-1 hover:underline" title="Submit Requirements">
              <ClipboardDocumentIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Submit Requirements</span>
            </button>
            {/* About & Contact */}
            <button onClick={() => open("about")} className="hover:underline">About</button>
            <button onClick={() => open("contact")} className="hover:underline">Contact</button>
          </nav>
        </div>
      </header>

      {/* Hero Section with video and curve */}
      <section className="relative w-full" style={{ height: HERO_HEIGHT, minHeight: 350, overflow: "hidden" }}>
        {/* Background Video */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" style={{ pointerEvents: "none" }}>
          <source src="https://www.alcon.com/sites/g/files/rbvwei4411/files/2024-09/Evergreen_Campaign_whitebg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Guide Button */}
        <button type="button" className="absolute top-6 right-8 text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 z-20"
          onClick={() => open("guide")} style={{ zIndex: 20 }}>
          <QuestionMarkCircleIcon className="h-6 w-6" />
          <span className="hidden sm:inline font-medium">Guide</span>
        </button>
        {/* SVG Blue Curve */}
        <div className="absolute left-0 w-full" style={{ bottom: "-10px", height: "80px", pointerEvents: "none", zIndex: 10 }}>
          <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none"
            style={{ display: "block", position: "absolute", left: 0, bottom: 0 }}>
            <path fill="#005eb8" d="M0,40 Q720,120 1440,40 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Blue Section with tagline and description */}
      <section className="w-full bg-[#005eb8] text-white text-center flex flex-col justify-end"
        style={{ paddingTop: "10px", paddingBottom: "20px" }}>
        <h2 className="text-2xl md:text-3xl font-light mb-1">We Help People See Brilliantly</h2>
        <p className="text-base md:text-lg max-w-3xl mx-auto">
          We aspire to lead the world in innovating life-changing vision products because when people see brilliantly, they live brilliantly.
        </p>
      </section>

      {/* Main Content */}
      <main className="flex-1 bg-white">{/* ...rest of your page content... */}</main>

      {/* Popups/Modals */}
      {modals.about && <AboutPopup onClose={() => close("about")} />}
      {modals.contact && <ContactPopup onClose={() => close("contact")} />}
      {modals.admin && <AdminLogin onClose={() => close("admin")} />}
      {modals.user && <UserLogin onClose={() => close("user")} />}
      {modals.req && <RequirementPopup onClose={() => close("req")} onSubmit={handleRequirementSubmit} />}
      {modals.guide && <HomeGuidePopup onClose={() => close("guide")} />}

      {/* Footer */}
      <footer className="bg-alconBlue text-white text-center py-4 shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default Home;
