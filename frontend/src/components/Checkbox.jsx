import React from "react";

const Checkbox = ({ label, checked, onChange }) => (
  <div className="flex flex-row items-center justify-center mb-2">
    <label className="mb-0 mr-4 w-1/5 text-right">{label}</label>
    <input
      type="checkbox"
      className="w-5 h-5 border border-gray-500 rounded shadow-lg"
      checked={!!checked}
      onChange={e => onChange(e.target.checked)}
      style={{ width: "24px", height: "24px" }}
    />
  </div>
);

export default Checkbox;