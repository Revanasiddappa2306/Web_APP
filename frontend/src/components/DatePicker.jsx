import React from "react";

const DatePicker = ({ label }) => (
  <div className="flex flex-col">
    <label className="mb-1">{label || "Date Picker"}</label>
    <input type="date" className="p-2 rounded text-black" />
  </div>
);

export default DatePicker;
