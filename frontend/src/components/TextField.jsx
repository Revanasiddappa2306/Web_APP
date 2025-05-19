import React from "react";

const TextField = ({ label, value, onChange }) => (
  <div className="flex flex-row items-center justify-center mb-2">
    <label className="mb-0 mr-4 w-1/5 text-right">{label}</label>
    <input
      type="text"
      className="p-2 rounded text-black border border-gray-500 w-3/5 mx-auto shadow-lg"
      value={value || ""}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default TextField;