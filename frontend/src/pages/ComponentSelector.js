// src/pages/ComponentSelector.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { componentsLibrary } from "../components/componentsLibrary";
import Button from "../components/Button1";

const ComponentSelector = () => {
  const navigate = useNavigate();
  const [selectedComponents, setSelectedComponents] = useState({});

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
            <button
              onClick={handleBackToDashboard}
              className="hover:text-yellow-300"
            >
              Home
            </button>
            <button onClick={() => navigate("/your-pages")} className="hover:text-yellow-300">Pages</button>
            <button className="hover:text-yellow-300">About</button>
            <button className="hover:text-yellow-300">Contact</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 text-gray-900 p-6">
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

        <div className="mt-8">
          <Button
            text="Next Configure Fields"
            onClick={handleGenerate}
            className="w-1/3 bg-green-600 hover:bg-green-700 text-white py-2 px-4 text-sm rounded mx-auto block"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center p-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ComponentSelector;
