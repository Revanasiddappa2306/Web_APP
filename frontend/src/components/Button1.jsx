import React from "react";

const Button1 = ({ text, onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-3/5 mx-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow-lg flex justify-center ${className}`}
  >
    {text}
  </button>
);

export default Button1;