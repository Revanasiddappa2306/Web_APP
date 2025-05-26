// src/components/ContactPopup.js
import React from "react";

const ContactPopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div  className="bg-white p-6 rounded shadow-md relative overflow-y-auto"
      style={{ width: "70vw", maxHeight: "80vh" }}>
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 text-xl">&times;</button>
      <h2 className="text-xl font-bold text-center text-[#003595] mb-4">Contact Us</h2>
      <div className="max-w-3xl mx-auto text-lg space-y-6 leading-relaxed">
          <p>
            We'd love to hear from you! Whether you have questions, suggestions, or need support, feel free to get in touch.
          </p>
          <div className="space-y-4">
            <div>
              <strong>Email:</strong> <span> We'll add shortly</span>
            </div>
            <div>
              <strong>Phone:</strong> <span> We'll add shortly</span>
            </div>
            <div>
              <strong>Address:</strong>
              <p>Alcon Laboratories.<br />
              10th Floor,RMZ Azure, Bengaluru, India</p>
            </div>
          </div>
        </div>
    </div>
  </div>
);

export default ContactPopup;
