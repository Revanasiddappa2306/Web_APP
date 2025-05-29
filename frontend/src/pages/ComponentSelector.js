// src/pages/ComponentSelector.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { componentsLibrary } from "../components/componentsLibrary";
import Button from "../components/Button1";
import AboutPopup from "../components/popups/AboutPopup";
import ContactPopup from "../components/popups/ContactPopup";  
import PageCreationGuidePopup from "../components/popups/PageCreationGuidePopup";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const ComponentSelector = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState({});
  const [showGuide, setShowGuide] = useState(false);

  const handleQuantityChange = (componentName, quantity) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [componentName]: {
        ...prev[componentName],
        quantity: Number(quantity),
      },
    }));
  };

  const handleGenerate = () => {
    // Check if at least one component is selected with quantity > 0
    const hasSelection = Object.values(selectedComponents).some(
      (comp) => comp.quantity && comp.quantity > 0
    );
    if (!hasSelection) {
      alert("Please select components first");
      return;
    }
    navigate("/configure-fields", { state: { selectedComponents } });
  };

  const handleBackToDashboard = () => {
    navigate("/admin-dashboard");
  };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            onClick={handleBackToDashboard}
            className="text-3xl font-bold cursor-pointer"
          >
            Alcon
          </h1>
          <nav className="flex items-center gap-8 text-lg font-medium">
            <button onClick={handleBackToDashboard} className="hover:text-yellow-300"> Home </button>
            <button onClick={() => navigate("/your-pages")} className="hover:text-yellow-300">Pages</button>
            <button onClick={() => setShowAbout(true)} className="hover:underline">About</button>
            <button onClick={() => setShowContact(true)} className="hover:underline">Contact</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 text-gray-900 p-6 relative">
        {/* Guide Button Top Right */}
        <button
          type="button"
          className="absolute top-6 right-8 text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
          onClick={() => setShowGuide(true)}
          style={{ zIndex: 20 }}
        >
          <QuestionMarkCircleIcon className="h-6 w-6" />
          <span className="hidden sm:inline font-medium">Guide</span>
        </button>

        <h1 className="text-2xl font-bold mb-6 text-center">
          Select Components
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(componentsLibrary).map(
            ([key, { label, component: Component }]) => (
              <div
                key={key}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
              >
                <h2 className="text-lg font-semibold mb-2">{label}</h2>

                {/* Render Preview of the Component */}
                <div className="mb-4 border p-2 rounded">
                  <Component label={label} />
                </div>

                {/* Quantity Input */}
                <label className="mb-1 text-sm">Quantity</label>
                <input
                  type="number"
                  min={0}
                  value={selectedComponents[key]?.quantity || 0}
                  onChange={(e) => handleQuantityChange(key, e.target.value)}
                  className="text-black p-2 rounded border w-full"
                />
              </div>
            )
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            text="Next Configure Fields"
            onClick={handleGenerate}
            className="w-60 bg-green-600 hover:bg-green-700 text-white py-2 px-4 text-sm rounded "
          />
        </div>
      </main>

      {/* Modal */}
      {showAbout && <AboutPopup onClose={() => setShowAbout(false)} />}
      {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
      {showGuide && <PageCreationGuidePopup onClose={() => setShowGuide(false)} />}  

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center p-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ComponentSelector;
