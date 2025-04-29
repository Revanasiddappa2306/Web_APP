import React from "react";

const RadioGroup = ({ label }) => (
  <div className="flex flex-col">
    <label className="mb-1">{label || "Radio Group"}</label>
    <div className="space-x-4">
      <label className="inline-flex items-center">
        <input type="radio" name="radioGroup" className="mr-2" /> Option 1
      </label>
      <label className="inline-flex items-center">
        <input type="radio" name="radioGroup" className="mr-2" /> Option 2
      </label>
    </div>
  </div>
);

export default RadioGroup;
