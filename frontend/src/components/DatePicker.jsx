import React from "react";

const DatePicker = ({ label, value, onChange }) => (
  <div className="flex flex-row items-center justify-center mb-2">
    <label className="mb-0 mr-4 w-1/5 text-right">{label || "Date Picker"}</label>
    <input
      type="date"
      className="p-2 rounded text-black border border-gray-500 w-3/5 mx-auto shadow-lg"
      value={value || ""}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default DatePicker;