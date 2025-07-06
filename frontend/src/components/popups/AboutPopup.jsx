// src/components/AboutPopup.js
import React from "react";

const AboutPopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div  className="bg-white p-6 rounded shadow-md relative overflow-y-auto"
      style={{ width: "70vw", maxHeight: "80vh" }}>
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 text-xl">&times;</button>
      <h2 className="text-xl font-bold text-center text-[#003595] mb-4">About Alcon</h2>
      <div className="max-w-3xl mx-auto text-lg space-y-6 leading-relaxed">
          <h1>Details are added shortly</h1>
         
        </div>
    </div>
  </div>
);

export default AboutPopup;
