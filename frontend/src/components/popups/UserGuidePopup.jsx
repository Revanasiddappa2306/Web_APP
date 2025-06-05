import React from "react";

const UserGuidePopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div
      className="bg-white p-6 rounded shadow-md relative overflow-y-auto"
      style={{ width: "70vw", maxHeight: "80vh" }}
    >
      <button
        className="absolute top-2 right-2 text-xl text-gray-700 hover:text-red-500"
        onClick={onClose}
      >×</button>
      <h2 className="text-xl font-bold mb-4 text-center text-alconBlue">User Guide</h2>
      <div className="text-gray-700 space-y-5">
        <div>
          <strong>Navbar Options:</strong>
          <ul className="list-disc pl-5">
            <li><b>About</b>: View information about the application.</li>
            <li><b>Contact</b>: Contact the admin for support or queries via Email or Teams.</li>
            <li><b>Submit Requirements</b>: Submit if any new requirements are there</li>
            <li><b>Logout</b>: Securely log out of your account.</li>
          </ul>
        </div>
        <div>
          <strong>Dashboard Functionality:</strong>
          <ul className="list-disc pl-5">
            <li>View all roles assigned to you.</li>
            <li>Hover over a role to see the list of pages you can access for that role.</li>
            <li>Click on a page name to open and use that page.</li>
            <li>If you need a new page or feature, use the <b>Submit Requirements</b> option to send your request to the admin.</li>
          </ul>
        </div>
        <div>
          <strong>Submitting Requirements:</strong>
          <ul className="list-disc pl-5">
            <li>Click <b>Submit Requirements</b> in the navbar.</li>
            <li>Your name, 521ID, and email will be auto-filled.</li>
            <li>Enter your department and the page name for your requirement.</li>
            <li>Select the components you need (e.g., TextField, Dropdown, etc.).</li>
            <li>For each component, specify the quantity and provide field names or options as required.</li>
            <li>Provide a justification for your requirement.</li>
            <li>Click <b>Submit</b> to send your request. An email will be generated and your request will be saved.</li>
          </ul>
        </div>
       
        <div>
          <strong>Your Role as a User:</strong>
          <ul className="list-disc pl-5">
            <li>Access only the pages and features assigned to your roles.</li>
            <li>Communicate requirements or issues to the admin using the provided options.</li>
            <li>Keep your account information secure and always log out after use.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default UserGuidePopup;