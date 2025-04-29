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

  return (
    <div className="min-h-screen bg-cyan-300 text-white p-6">
      <div className="flex justify-between mb-6">
        <h1 className=" text-2xl font-bold text-black" >Select Components</h1>
        <Button text="Back to Dashboard" onClick={() => navigate("/dashboard")} className="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(componentsLibrary).map(([key, { label, component: Component }]) => (
          <div key={key} className="bg-cyan-400 p-4 rounded-lg shadow-md flex flex-col justify-between">
            <h2 className="text-lg font-semibold mb-2 text-black">{label}</h2>

            {/* Render Preview of the Component */}
            <div className="mb-4">
              <Component label={label}/>
            </div>

            {/* Quantity Input */}
            <label className="mb-1 text-sm ">Quantity</label>
            <input
              type="number"
              min={0}
              value={selectedComponents[key]?.quantity || 0}
              onChange={(e) => handleQuantityChange(key, e.target.value)}
              className="text-black p-2 rounded w-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button text="Next Configure Fields" onClick={handleGenerate} className="w-1/3 bg-green-500 py-2 px-4 text-sm rounded mx-auto block" />
      </div>
    </div>
  );
};

export default ComponentSelector;

