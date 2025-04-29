// src/components/Dropdown.js
import React from "react";

const Dropdown = ({ label, value, options = [], onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1">{label}</label>
      <select
        className="p-2 rounded text-black"
        value={value}
        onChange={onChange}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
