import React from "react";

const Textarea = ({ label }) => (
  <div className="flex flex-col">
    <label className="mb-1">{label || "Textarea"}</label>
    <textarea className="p-2 rounded text-black" rows={3}></textarea>
  </div>
);

export default Textarea;
