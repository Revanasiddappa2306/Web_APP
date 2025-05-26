import React from "react";

const HomeGuidePopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div
      className="bg-white p-6 rounded shadow-md relative overflow-y-auto"
      style={{ width: "70vw", maxHeight: "80vh" }}
    >
      <button
        className="absolute top-2 right-2 text-xl text-gray-700 hover:text-red-500"
        onClick={onClose}
      >×</button>
      <h2 className="text-xl font-bold mb-4 text-center text-alconBlue">Home Page Guide</h2>
      <div className="text-gray-700 space-y-5">
        <div>
          <strong>Home Page Overview:</strong>
          <ul className="list-disc pl-5">
            <li>This is the entry point for all users and admins.</li>
            <li>Use the <b>Login</b> dropdown in the navbar to sign in as Admin or User.</li>
            <li>Access information about the application using the <b>About</b> button.</li>
            <li>Contact the admin or support using the <b>Contact</b> button.</li>
            <li>Submit your requirements directly from the home page using the <b>Submit Requirements</b> icon in the navbar.</li>
          </ul>
        </div>
        <div>
          <strong>How to Submit Requirements:</strong>
          <ol className="list-decimal pl-5">
            <li>Click the <b>Submit Requirements</b> icon in the navbar (clipboard icon).</li>
            <li>Fill in your name, 521ID, email, department, and describe your requirement.</li>
            <li>Click <b>Submit</b> to send your requirement to the admin.</li>
            <li>You will receive a confirmation message if your requirement is submitted successfully.</li>
          </ol>
        </div>
        <div>
          <strong>Rules & Best Practices:</strong>
          <ul className="list-disc pl-5">
            <li>Provide clear and concise details when submitting requirements.</li>
            <li>Use your official email and correct 521ID for identification.</li>
            <li>Do not share your login credentials with others.</li>
            <li>Contact admin for any issues or support using the Contact option.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default HomeGuidePopup;