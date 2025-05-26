import React, { useState } from "react";

const RequirementPopup = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    id: "",
    email: "",
    department: "",
    requirements: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded shadow-md relative overflow-y-auto"
        style={{ width: "80vw", maxWidth: "1100px", maxHeight: "90vh" }}
      >
        <button
          className="absolute top-2 right-2 text-xl text-gray-700 hover:text-red-500"
          onClick={onClose}
        >×</button>
        <h2 className="text-xl font-bold mb-4 text-alconBlue text-center">Submit Requirement</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-3">
            <input
              className="w-1/2 p-2 border rounded"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="w-1/2 p-2 border rounded"
              name="id"
              placeholder="521ID"
              value={form.id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-3">
            <input
              className="w-1/2 p-2 border rounded"
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              required
            />
            <input
              className="w-1/2 p-2 border rounded"
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <textarea
            className="w-full p-2 mb-3 border rounded"
            name="requirements"
            placeholder="Describe your requirements"
            rows={4}
            value={form.requirements}
            onChange={handleChange}
            required
          />
          <div className="flex justify-end">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequirementPopup;