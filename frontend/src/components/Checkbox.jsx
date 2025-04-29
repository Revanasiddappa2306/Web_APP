import React from "react";

const Checkbox = ({ label, checked, onChange, className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <label>{label}</label>
    </div>
  );
};

export default Checkbox;
