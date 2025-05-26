import React from "react";

const AdminGuidePopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div
      className="bg-white p-6 rounded shadow-md relative overflow-y-auto"
      style={{ width: "70vw", maxHeight: "80vh" }}
    >
      <button
        className="absolute top-2 right-2 text-xl text-gray-700 hover:text-red-500"
        onClick={onClose}
      >×</button>
      <h2 className="text-xl font-bold mb-4 text-center text-alconBlue">Admin Guide</h2>
      <div className="text-gray-700 space-y-5">
        <div>
          <strong>Navbar Options:</strong>
          <ul className="list-disc pl-5">
            <li><b>Actions</b>: Create new pages or view pages you have created.</li>
            <li><b>Guide</b>: View this admin guide.</li>
            <li><b>About</b>: Information about the application.</li>
            <li><b>Contact</b>: Contact support or get help.</li>
            <li><b>Requests</b>: View and manage user requirements and requests.</li>
            <li><b>Logout</b>: Securely log out of your admin account.</li>
          </ul>
        </div>
        <div>
          <strong>Dashboard Functionality:</strong>
          <ul className="list-disc pl-5">
            <li>View and manage all pages, roles, users, and their assignments.</li>
            <li>Assign pages to roles and roles to users for access control.</li>
            <li>Monitor and respond to user requirements in the Requests section.</li>
          </ul>
        </div>
        <div>
          <strong>How to Create a New Page:</strong>
          <ol className="list-decimal pl-5">
            <li>Click on <b>Actions</b> in the navbar and select <b>Create Page</b>.</li>
            <li>This opens the component selection page. Select the components you need and press <b>Configure Fields</b>.</li>
            <li>Configure the selected components on the configuration page and press <b>Create Page</b>.</li>
            <li>The system creates the page and asks if you want to create a table. If yes, a table is created in the backend automatically and the newly created page opens.</li>
          </ol>
        </div>
        <div>
          <strong>How to Create a Role:</strong>
          <ol className="list-decimal pl-5">
            <li>On the admin home, select <b>Create Role</b>.</li>
            <li>A popup appears asking for the role name. Fill in the name and press OK. The new role is created.</li>
          </ol>
        </div>
        <div>
          <strong>How to Assign Pages to a Role:</strong>
          <ol className="list-decimal pl-5">
            <li>Select pages in the Pages table and press <b>Assign</b>.</li>
            <li>A popup with available roles appears. Select the needed roles and press OK. The pages are assigned to the selected roles.</li>
          </ol>
        </div>
        <div>
          <strong>How to Assign Users to Roles:</strong>
          <ol className="list-decimal pl-5">
            <li>Select users from the Users table and press <b>Assign</b>.</li>
            <li>A popup with available roles appears. Select the needed roles and press OK. The users are now assigned to those roles.</li>
          </ol>
        </div>
        <div>
          <strong>Request Handling:</strong>
          <ol className="list-decimal pl-5">
            <li>Click <b>Requests</b> in the navbar to view all requests (read and unread).</li>
            <li>Handle a request as needed and mark it as read when done.</li>
          </ol>
        </div>
        <div>
          <strong>Your Role as an Admin:</strong>
          <ul className="list-disc pl-5">
            <li>Maintain and organize the structure of pages, roles, and users.</li>
            <li>Ensure users have access only to the pages relevant to their roles.</li>
            <li>Respond to user requirements and feedback promptly.</li>
            <li>Keep the system secure by managing assignments and monitoring activity.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default AdminGuidePopup;