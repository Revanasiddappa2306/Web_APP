import React from "react";

const NumberInput = ({ label }) => (
  <div className="flex flex-col">
    <label className="mb-1">{label || "Number Input"}</label>
    <input type="number" className="p-2 rounded text-black" />
  </div>
);

export default NumberInput;
