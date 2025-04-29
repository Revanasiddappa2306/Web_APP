import React from "react";

const ToggleSwitch = ({ label }) => (
    <div className="flex flex-col">
      <label className="mb-1">{label || "Toggle Switch"}</label>
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 relative transition-colors duration-300">
          <div
            className="
              w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 
              transition-transform duration-300
              peer-checked:translate-x-5
            "
          ></div>
        </div>
      </label>
    </div>
  );

export default ToggleSwitch;
