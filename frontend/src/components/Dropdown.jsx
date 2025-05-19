import React from "react";

const Dropdown = ({ label, value, onChange, options = [] }) => (
  <div className="flex flex-row items-center justify-center mb-2">
    <label className="mb-0 mr-4 w-1/5 text-right">{label}</label>
    <select
      className="p-2 rounded text-black border border-gray-500 w-3/5 mx-auto shadow-lg"
      value={value || ""}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default Dropdown;