import React from "react";

const TextField = ({ label, value, onChange, type = "text", className }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border p-2 rounded"
      />
    </div>
  );
};

export default TextField;
